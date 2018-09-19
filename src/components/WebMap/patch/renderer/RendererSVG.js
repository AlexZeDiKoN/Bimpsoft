/* global L */
import './RendererSVG.css'
import { entityKind } from '../../leaflet.pm.patch'

const epsilon = 1e-5 // Досить мале число, яке можемо вважати нулем

const RendererSVG = L.SVG.extend({
  _initContainer: function () {
    L.SVG.prototype._initContainer.call(this)
    const filter = L.SVG.create('filter')
    filter.setAttribute('id', 'blurFilter')
    filter.innerHTML = `<feGaussianBlur in="StrokePaint" stdDeviation="2"></feGaussianBlur>`
    this._container.appendChild(filter)
  },
  _initPath: function (layer) {
    layer._outlinePath = L.SVG.create('path')
    L.DomUtil.addClass(layer._outlinePath, 'leaflet-interactive leaflet-interactive-outline')

    layer._shadowPath = L.SVG.create('path')
    L.DomUtil.addClass(layer._shadowPath, 'dzvin-path-shadow')

    L.SVG.prototype._initPath.call(this, layer)
  },
  _updateStyle: function (layer) {
    L.SVG.prototype._updateStyle.call(this, layer)
    const { options } = layer
    if (options.shadowColor) {
      layer._shadowPath.removeAttribute('display')
      layer._shadowPath.setAttribute('filter', 'url(#blurFilter)')
      layer._shadowPath.setAttribute('stroke', options.shadowColor)
    } else {
      layer._shadowPath.setAttribute('display', 'none')
    }
  },
  _addPath: function (layer) {
    this._rootGroup.appendChild(layer._shadowPath)

    this._rootGroup.appendChild(layer._outlinePath)
    layer.addInteractiveTarget(layer._outlinePath)

    this._rootGroup.appendChild(layer._path)
    layer.addInteractiveTarget(layer._path)
  },
  _setPath: function (layer, path) {
    L.SVG.prototype._setPath.call(this, layer, path)
    layer._outlinePath.setAttribute('d', path)
    layer._shadowPath.setAttribute('d', path)
  },
  _removePath: function (layer) {
    L.DomUtil.remove(layer._path)
    layer.removeInteractiveTarget(layer._path)

    L.DomUtil.remove(layer._outlinePath)
    layer.removeInteractiveTarget(layer._outlinePath)

    L.DomUtil.remove(layer._shadowPath)
  },
  _updatePoly: function (layer, closed) {
    let result = L.SVG.pointsToPath(layer._rings, closed)
    const skipStart = layer.options && layer.options.skipStart
    const skipEnd = layer.options && layer.options.skipEnd
    const kind = layer.options && layer.options.tsType
    const length = layer._rings && layer._rings.length === 1 && layer._rings[0].length
    if (kind === entityKind.SEGMENT && length === 2 && layer.options.tsTemplate) {
      const js = layer.options.tsTemplate
      if (js && js.svg && js.svg.path && js.svg.path[0] && js.svg.path[0].$ && js.svg.path[0].$.d) {
        result = prepareLinePath(js, js.svg.path[0].$.d, layer._rings[0])
      }
    } else if (kind === entityKind.AREA && length >= 3) {
      result = prepareBezierPath(layer._rings[0], true)
    } else if (kind === entityKind.CURVE && length >= 2) {
      result = prepareBezierPath(layer._rings[0], false, skipStart && length > 3, skipEnd && length > 3)
    }
    this._setPath(layer, result)
  },
})

function prepareLinePath (js, d, rings) {
  const decodedPath = parseSvgPath(d)
  const dist = Math.hypot(rings[0].x - rings[1].x, rings[0].y - rings[1].y)
  const p1 = js.svg.$['line-point-1'].split(',')
  const p2 = js.svg.$['line-point-2'].split(',')
  const templateDist = Math.hypot(p1[0] - p2[0], p1[1] - p2[1])
  // пропорційно розтягуємо елементи 'H', щоб отримати потрібну сумарну ширину значка
  strechH(decodedPath, dist, templateDist)
  // зсув значка до співпадання першої точки відрізка з засічкою першої точки на значку
  translate(decodedPath, rings[0].x - p1[0], rings[0].y - p1[1])
  makeSVGPathCommandsAbsolute(decodedPath)
  rotate(decodedPath, calcSinCos(rings[0], rings[1]), rings[0].x, rings[0].y)
  return wrapSvgPath(decodedPath)
}

function wrapSvgPath (a) {
  return a.map((cmd) => cmd.join(' ')).join(' ') || 'M 0 0'
}

function prepareBezierPath (ring, locked, skipStart, skipEnd) {
  let str = ''
  for (const item of prepareCurve(ring.map((r) => [ r.x, r.y ]), ring, locked, skipStart, skipEnd)) {
    str += `${(typeof item === 'string' ? item : `${item[0]} ${item[1]}`)} `
  }
  return str || 'M0 0'
}

function parseSvgPath (svg) {
  const length = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 }
  const segment = /([astvzqmhlc])([^astvzqmhlc]*)/ig
  const number = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig
  function parse (path) {
    const data = []
    path.replace(segment, function (_, command, args) {
      let type = command.toLowerCase()
      args = parseValues(args)
      if (type === 'm' && args.length > 2) {
        data.push([ command ].concat(args.splice(0, 2)))
        type = 'l'
        command = command === 'm' ? 'l' : 'L'
      }
      while (true) {
        if (args.length === length[type]) {
          args.unshift(command)
          return data.push(args)
        }
        if (args.length < length[type]) {
          throw new Error('Malformed path data!')
        }
        data.push([ command ].concat(args.splice(0, length[type])))
      }
    })
    return data
  }

  function parseValues (args) {
    const numbers = args.match(number)
    return numbers ? numbers.map(Number) : []
  }

  return parse(svg)
}

function translate (a, x, y) {
  if (!x && !y) {
    return
  }
  a.forEach((cmd) => {
    if (cmd[0] === cmd[0].toUpperCase()) { // абсолютні координати
      let pointCount = 0
      let pointOffset = 1
      switch (cmd[0]) {
        case 'Z':
          break
        case 'M':
        case 'L':
        case 'T': {
          pointCount = 1
          break
        }
        case 'S':
        case 'Q': {
          pointCount = 2
          break
        }
        case 'C': {
          pointCount = 3
          break
        }
        case 'A': {
          pointCount = 1
          pointOffset = 6
          break
        }
        case 'H': {
          cmd[ 1 ] += x
          break
        }
        case 'V': {
          cmd[ 1 ] += y
          break
        }
        default:
          throw new Error('Unknown SVG path command: ' + cmd[0])
      }
      for (let i = 0; i < pointCount; i++) {
        cmd[pointOffset + i * 2] += x
        cmd[pointOffset + i * 2 + 1] += y
      }
    }
  })
}

function rotate (a, [ sin, cos, angle ], x, y) {
  translate(a, -x, -y)
  a.forEach((cmd) => {
    if (cmd[0] === cmd[0].toUpperCase()) { // абсолютні координати
      let pointCount = 0
      let pointOffset = 1
      switch (cmd[0]) {
        case 'M':
        case 'L':
        case 'T': {
          pointCount = 1
          break
        }
        case 'S':
        case 'Q': {
          pointCount = 2
          break
        }
        case 'C': {
          pointCount = 3
          break
        }
        case 'A': {
          pointCount = 1
          pointOffset = 6
          cmd[3] += angle
          break
        }
        case 'H': {
          cmd[1] += x
          break
        }
        case 'V': {
          cmd[1] += y
          break
        }
        default:
          throw new Error('Unknown SVG path command: ' + cmd[0])
      }
      for (let i = 0; i < pointCount; i++) {
        const xx = cmd[pointOffset + i * 2]
        const yy = cmd[pointOffset + i * 2 + 1]
        cmd[pointOffset + i * 2] = xx * cos - yy * sin
        cmd[pointOffset + i * 2 + 1] = xx * sin + yy * cos
      }
    }
  })
  translate(a, x, y)
}
function makeSVGPathCommandsAbsolute (a) {
  let subpathStart
  let prevCmd = [ 0, 0 ]
  a.forEach((cmd) => {
    const originalCommand = cmd[0]
    const lowerCaseCommand = cmd[0].toLowerCase()
    if (lowerCaseCommand === 'm') {
      subpathStart = cmd.slice(1, 3)
    } else if (lowerCaseCommand === 'h') {
      if (lowerCaseCommand === originalCommand) {
        cmd[1] += prevCmd[0]
      }
      cmd[0] = 'L'
      cmd.push(prevCmd[1])
    } else if (lowerCaseCommand === 'v') {
      if (lowerCaseCommand === originalCommand) {
        cmd[1] += prevCmd[1]
      }
      cmd[0] = 'L'
      cmd.splice(1, 0, prevCmd[0])
    }
    if (lowerCaseCommand === originalCommand) {
      let pointOffset = 1
      let pointCount = 1
      switch (lowerCaseCommand) {
        case 'm':
        case 'l':
        case 't':
          break
        case 's':
        case 'q': {
          pointCount = 2
          break
        }
        case 'c': {
          pointCount = 3
          break
        }
        case 'a': {
          pointOffset = 6
          break
        }
        default:
          pointCount = 0
      }
      for (let i = 0; i < pointCount; i++) {
        cmd[pointOffset + i * 2] += prevCmd[0]
        cmd[pointOffset + i * 2 + 1] += prevCmd[1]
      }
    }
    cmd[0] = cmd[0].toUpperCase()
    prevCmd = lowerCaseCommand === 'z'
      ? subpathStart.slice(0, 2)
      : cmd.slice(cmd.length - 2)
  })
}

function strechH (decodedPath, dist, templateDist) {
  const arrH = decodedPath.filter((cmd) => cmd[0] === 'h')
  const sumH = arrH.reduce((accum, cmd) => accum + cmd[1], 0)
  if (sumH > epsilon) { // !== 0
    const factor = (dist - (templateDist - sumH)) / sumH
    arrH.map((cmd) => (cmd[1] = cmd[1] * factor))
  }
}

function calcSinCos (p1, p2) {
  if (p1.x === p2.x && p1.y === p2.y) {
    return [ 0, 1, 0 ]
  }
  const len = Math.hypot(p1.x - p2.x, p1.y - p2.y)
  const result = [ (p2.y - p1.y) / len, (p2.x - p1.x) / len ]
  result.push(Math.asin(result[0]))
  if (result[1] < 0) {
    result[2] = Math.PI - result[2]
  }
  result[2] = result[2] / Math.PI * 180
  return result
}

function prepareCurve (points, ring, locked, skipStart, skipEnd) {
  const prevIdx = (idx) => idx > 0 ? idx - 1 : points.length - 1
  const nextIdx = (idx) => idx < points.length - 1 ? idx + 1 : 0
  const pt = (pa) => ({ x: pa[0], y: pa[1] })

  let result, cp1, cp2, last, mem

  if (locked) {
    [ cp1, cp2 ] = calcControlPoint(points[prevIdx(0)], points[0], points[nextIdx(0)])
    ring[0].cp1 = pt(cp1)
    ring[0].cp2 = pt(cp2)
    last = cp1
    mem = cp2
    result = [ 'M', points[0] ]
    for (let i = 1; i < points.length; i++) {
      [ cp1, cp2 ] = calcControlPoint(points[prevIdx(i)], points[i], points[nextIdx(i)])
      ring[i].cp1 = pt(cp1)
      ring[i].cp2 = pt(cp2)
      result = result.concat([ 'C', mem, cp1, points[i] ])
      mem = cp2
    }
    result = result.concat([ 'C', mem, last, points[0], 'Z' ])
  } else {
    ring[0].cp1 = pt(points[0])
    ring[0].cp2 = pt(points[0])
    mem = points[0]
    result = []
    if (!skipStart) {
      result = result.concat([ 'M', points[0] ])
    }
    for (let i = 1; i < points.length - 1; i++) {
      [ cp1, cp2 ] = calcControlPoint(points[i - 1], points[i], points[i + 1])
      ring[i].cp1 = pt(cp1)
      ring[i].cp2 = pt(cp2)
      if (skipStart && i === 1) {
        result = result.concat([ 'M', points[i] ])
      } else {
        result = result.concat([ 'C', mem, cp1, points[i] ])
      }
      mem = cp2
    }
    ring[points.length - 1].cp1 = pt(points[points.length - 1])
    ring[points.length - 1].cp2 = pt(points[points.length - 1])
    if (!skipEnd) {
      result = result.concat([ 'C', mem, points[ points.length - 1 ], points[ points.length - 1 ] ])
    }
  }
  return result
}

function calcControlPoint (pp, pc, pn) {
  const eq = (a, b) => Math.abs(a[0] - b[0]) < epsilon && Math.abs(a[1] - b[1]) < epsilon // a[0] === b[0] && a[1] === b[1]
  const sub = (a, b) => [ b[0] - a[0], b[1] - a[1] ]
  const mul = (p, f) => [ p[0] * f, p[1] * f ]
  const add = (a, b) => [ a[0] + b[0], a[1] + b[1] ]
  const len = (p) => Math.hypot(p[0], p[1])
  const norm = (p, f) => len(p) < epsilon ? [ 0, 0 ] : mul([ p[1], -p[0] ], f / len(p)) // === 0

  if (eq(pp, pn)) { // (eq(pp, pc) && eq(pn, pc)) ||
    return [ pc, pc ]
  }
  if (eq(pp, pc)) {
    return [ pc, add(pc, mul(sub(pc, pn), 1 / 3)) ]
  }
  if (eq(pn, pc)) {
    return [ add(pc, mul(sub(pc, pp), 1 / 3)), pc ]
  }
  let dpp = sub(pc, pp)
  let dpn = sub(pc, pn)
  const lp = len(dpp)
  const ln = len(dpn)
  if (eq(dpn, dpp)) {
    return [ norm(sub(pp, pc), lp / 3), norm(dpn, ln / 3) ]
  }
  if (lp > ln) {
    if (ln > epsilon) { // !== 0
      dpn = mul(dpn, lp / ln)
    }
  } else {
    if (lp > epsilon) { // !== 0
      dpp = mul(dpp, ln / lp)
    }
  }
  const dir = sub(dpn, dpp)
  const ld = len(dir)
  const [ cpp, cpn ] = ld < epsilon ? [ [ 0, 0 ], [ 0, 0 ] ] : [ mul(dir, lp / 3 / ld), mul(dir, -ln / 3 / ld) ] // === 0
  return [ add(cpp, pc), add(cpn, pc) ]
}

export default RendererSVG
