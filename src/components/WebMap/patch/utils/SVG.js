/* global DOMParser */
import { epsilon, interpolateSize } from './helpers'
import { drawLine, emptyPath, getMaxPolygon } from '../Sophisticated/utils'

// ------------------------ Функції роботи з нутрощами SVG -------------------------------------------------------------
export function parseSvgPath (svg) {
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

function wrapSvgPath (a) {
  return a.map((cmd) => cmd.join(' ')).join(' ') || 'M 0 0'
}

function stretchH (decodedPath, dist, templateDist) {
  const arrH = decodedPath.filter((cmd) => cmd[0] === 'h')
  const sumH = arrH.reduce((accum, cmd) => accum + cmd[1], 0)
  if (sumH > epsilon) { // !== 0
    const factor = (dist - (templateDist - sumH)) / sumH
    arrH.map((cmd) => (cmd[1] = cmd[1] * factor))
  }
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

export function makeSVGPathCommandsAbsolute (a) {
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

export function prepareLinePath (js, d, rings) {
  const decodedPath = parseSvgPath(d)
  const dist = Math.hypot(rings[0].x - rings[1].x, rings[0].y - rings[1].y)
  const p1 = js.svg.$['line-point-1'].split(',')
  const p2 = js.svg.$['line-point-2'].split(',')
  const templateDist = Math.hypot(p1[0] - p2[0], p1[1] - p2[1])
  // пропорційно розтягуємо елементи 'H', щоб отримати потрібну сумарну ширину значка
  stretchH(decodedPath, dist, templateDist)
  // зсув значка до співпадання першої точки відрізка з засічкою першої точки на значку
  translate(decodedPath, rings[0].x - p1[0], rings[0].y - p1[1])
  makeSVGPathCommandsAbsolute(decodedPath)
  rotate(decodedPath, calcSinCos(rings[0], rings[1]), rings[0].x, rings[0].y)
  return wrapSvgPath(decodedPath)
}

export function makeHeadGroup (line, parts) {
  // TODO 5235
}

export function makeLandGroup (line, parts) {
  // TODO 5235
}

export function makeRegionGroup (layer) {
  const points = layer._groupChildren.map((marker) => layer._map.latLngToLayerPoint(marker._latlng))
  const polygon = getMaxPolygon(points)
  const rectanglePoints = []

  const dy = interpolateSize(layer._map.getZoom(), layer.scaleOptions?.pointSizes) * 0.5 * 1.2
  const dx = dy * 1.5

  polygon.forEach((elm, number) => {
    rectanglePoints.push({ x: elm.x - dx, y: elm.y - dy, number })
    rectanglePoints.push({ x: elm.x + dx, y: elm.y - dy, number })
    rectanglePoints.push({ x: elm.x - dx, y: elm.y + dy, number })
    rectanglePoints.push({ x: elm.x + dx, y: elm.y + dy, number })
  })
  const rectanglePolygon = getMaxPolygon(rectanglePoints)

  const result = emptyPath()
  drawLine(result, ...rectanglePolygon)
  return `${result.d} z`
}

/* function getCentralPoint (js) {
  const result = { x: 0, y: 0 }
  if (js.svg.$.width && js.svg.$.height) {
    if (js.svg.$['central-point']) {
      const xy = js.svg.$['central-point'].split(',')
      result.x = xy[0]
      result.y = xy[1]
    } else {
      result.x = js.svg.$.width / 2
      result.y = js.svg.$.height / 2
    }
    result.x = Math.round(result.x / js.svg.$.width) //  * pointSignSize inside brackets
    result.y = Math.round(result.y / js.svg.$.height) //  * pointSignSize inside brackets
  }
  return result
} */

export function svgToJS (svg) {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(svg, 'text/xml')
  const js = documentToJS(xmlDoc)
  if (js && js.svg && js.svg.path && !Array.isArray(js.svg.path)) {
    js.svg.path = [ js.svg.path ]
  }
  return js
}

function documentToJS (document) {
  const root = {}
  function elementToJS (node, element) {
    node.$ = {}
    if (element.attributes) {
      for (const attr of element.attributes) {
        node.$[attr.nodeName] = attr.value
      }
    }
    for (const item of element.children) {
      const tag = item.tagName
      const child = {}
      elementToJS(child, item)
      if (!node[tag]) {
        node[tag] = child
      } else if (Array.isArray(node[tag])) {
        node[tag].push(child)
      } else {
        node[tag] = [ node[tag], child ]
      }
    }
  }
  elementToJS(root, document)
  return root
}

/* function jsToSvg (js) {
  function tagToText (tagName, tag) {
    let result = ''
    if (Array.isArray(tag)) {
      for (const item of tag) {
        result += tagToText(tagName, item)
      }
    } else {
      result += `<${tagName}`
      for (const a of Object.keys(tag.$)) {
        result += ` ${a}="${tag.$[a]}"`
      }
      let inner = ''
      for (const child of Object.keys(tag)) {
        if (child !== '$') {
          inner += tagToText(child, tag[child])
        }
      }
      result += inner === '' ? ' />' : `>${inner}</${tagName}>`
    }
    return result
  }
  return tagToText('svg', js.svg)
} */
