/* global L */
import Bezier from 'bezier-js'
import entityKind from '../entityKind'
import { extractSubordinationLevelSVG } from '../../../utils/svg/milsymbol'
import subordinationLevels from '../../../constants/SubordinationLevel'
import { prepareLinePath } from './utils/SVG'
import { prepareBezierPath } from './utils/Bezier'
import './SVG.css'

// ------------------------ Патч ядра Leaflet для візуалізації поліліній і полігонів засобами SVG ----------------------

const AMPLIFIERS_STEP = 144 // (пікселів) крок відображення ампліфікаторів на лініях
const AMPLIFIERS_SIZE = 96 // (пікселів) розмір тактичного знака, з якого знімаємо ампліфікатор рівня підрозділу
const AMPLIFIERS_WINDOW_MARGIN = 6 // (пікселів) ширина ободків навкого ампліфікатора
const AMPLIFIERS_STROKE_WIDTH = 6 // (пікселів) товщина пера (у масштабі), яким наносяться ампліфікатори

const WAVE_STEP = 36 // (пікселів) ширина "хвилі" для хвилястої лінії
const WAVE_SIZE = 24 // (пікселів) висота "хвилі" для хвилястої лінії

// const STROKE_STEP = 18 // (пікселів) відстань між "засічками" для лінії з засічками
// const STROKE_SIZE = 18 // (пікселів) висота "засічки" для лінії з засічками

// TODO потенційно це місце просадки продуктивності:
// TODO * при маленьких значеннях будуть рвані лінії
// TODO * при великих може гальмувати відмальовка
const LUT_STEPS = 1000 // кількість ділянок, на які розбивається сегмент кривої Безьє для обчислення довжин і пропорцій

const DRAW_PARTIAL_WAVES = true

const ampSigns = subordinationLevels.list.reduce((res, { value }) => ({
  ...res,
  [value]: extractSubordinationLevelSVG(value, AMPLIFIERS_SIZE, AMPLIFIERS_WINDOW_MARGIN),
}), {})

const dist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y)
const vector = (ps, pf) => ({ x: pf.x - ps.x, y: pf.y - ps.y })
const normal = (v) => ({ x: +v.y, y: -v.x })
const length = (v) => Math.hypot(v.x, v.y)
const multiply = (v, k) => ({ x: v.x * k, y: v.y * k })
const setLength = (v, l) => multiply(v, l / length(v))
const apply = (p, v) => ({ x: p.x + v.x, y: p.y + v.y })

class Segment {
  constructor (start, finish) {
    this.start = start
    this.vector = {
      x: finish.x - start.x,
      y: finish.y - start.y,
    }
  }

  length = () => Math.hypot(this.vector.x, this.vector.y)

  get = (part) => ({
    x: this.start.x + this.vector.x * part,
    y: this.start.y + this.vector.y * part,
  })

  normal = () => ({
    x: -this.vector.y,
    y: +this.vector.x,
  })
}

const prepareLUT = (lut) => {
  let acc = 0
  lut[0].al = 0
  for (let i = 1; i < lut.length; i++) {
    acc += dist(lut[i], lut[i - 1])
    lut[i].al = acc
  }
}

const getPart = (lut, pos, start = 0, finish = 0) => {
  if (finish === 0) {
    finish = lut.length - 1
  }
  if (lut[start].al >= pos || start === finish) {
    return start / LUT_STEPS
  }
  if (lut[finish] < pos) {
    return finish / LUT_STEPS
  }
  if (finish - start === 1) {
    const ds = pos - lut[start].al
    const df = lut[finish].al - pos
    return (ds <= df ? start : finish) / LUT_STEPS
  }
  const mid = Math.floor((start + finish) / 2)
  return lut[mid].al > pos
    ? getPart(lut, pos, start, mid)
    : getPart(lut, pos, mid, finish)
}

const buildPeriodicPoints = (step, offset, points, bezier, locked, insideMap) => {
  const nextIndex = (index) => locked && index === points.length - 1 ? 0 : index + 1
  const bezierArray = (points, index) => {
    const next = nextIndex(index)
    return [
      points[index].x,
      points[index].y,
      points[index].cp2.x,
      points[index].cp2.y,
      points[next].cp1.x,
      points[next].cp1.y,
      points[next].x,
      points[next].y,
    ]
  }
  const lineArray = (points, index) => {
    const next = nextIndex(index)
    return [
      points[index],
      points[next],
    ]
  }
  const amplPoints = []
  const last = points.length - Number(!locked)
  for (let i = 0; i < last; i++) {
    const segment = bezier
      ? new Bezier(...bezierArray(points, i))
      : new Segment(...lineArray(points, i))
    let lut = null
    if (bezier) {
      lut = segment.getLUT(LUT_STEPS)
      prepareLUT(lut)
    }
    const length = segment.length()
    if (length > 0) {
      let pos = offset + step
      while (pos < length) {
        const part = bezier
          ? getPart(lut, pos)
          : pos / length
        const amplPoint = segment.get(part)
        amplPoint.n = segment.normal(part)
        amplPoint.r = (Math.atan2(amplPoint.n.y, amplPoint.n.x) / Math.PI + 0.5) * 180
        amplPoint.i = insideMap(amplPoint)
        amplPoint.o = i < last - 1 || length - pos > step / 5
        amplPoints.push(amplPoint)
        pos += step
      }
      offset = pos - step - length
    }
  }
  return amplPoints
}

const _initContainer = L.SVG.prototype._initContainer
const _initPath = L.SVG.prototype._initPath
const _updateStyle = L.SVG.prototype._updateStyle
const _setPath = L.SVG.prototype._setPath
const _addPath = L.SVG.prototype._addPath
const _removePath = L.SVG.prototype._removePath

export default L.SVG.include({
  _initContainer: function () {
    _initContainer.call(this)
    this._initBlurFilter()
  },

  _initBlurFilter: function () {
    const filter = L.SVG.create('filter')
    filter.setAttribute('id', 'blurFilter')
    filter.innerHTML = `<feGaussianBlur in="StrokePaint" stdDeviation="2" />`
    this._container.appendChild(filter)
  },

  _initPath: function (layer) {
    layer._outlinePath = L.SVG.create('path')
    L.DomUtil.addClass(layer._outlinePath, 'leaflet-interactive leaflet-interactive-outline')

    layer._shadowPath = L.SVG.create('path')
    L.DomUtil.addClass(layer._shadowPath, 'dzvin-path-shadow')

    _initPath.call(this, layer)
  },

  _updateStyle: function (layer) {
    _updateStyle.call(this, layer)
    const {
      options: { shadowColor, opacity = 1, hidden, selected },
      _shadowPath,
      _path,
      _amplifierGroup,
      _outlinePath,
    } = layer

    if (shadowColor) {
      _shadowPath.removeAttribute('display')
      _shadowPath.setAttribute('filter', 'url(#blurFilter)')
      _shadowPath.setAttribute('stroke', shadowColor)
    } else {
      _shadowPath.setAttribute('display', 'none')
    }
    if (_path.style.opacity !== opacity) {
      _path.style.opacity = opacity
      _outlinePath.style.opacity = opacity
      _shadowPath.style.opacity = opacity
    }
    if ((_path.style.display === 'none') !== Boolean(hidden)) {
      _path.style.display = hidden ? 'none' : ''
      _outlinePath.style.display = hidden ? 'none' : ''
      _shadowPath.style.display = hidden ? 'none' : ''
      _amplifierGroup && (_amplifierGroup.style.display = hidden ? 'none' : '')
    }
    const hasClassSelected = _path.classList.contains('dzvin-path-selected')
    if (hasClassSelected !== selected) {
      const action = selected ? 'add' : 'remove'
      _path.classList[action]('dzvin-path-selected')
      _amplifierGroup && _amplifierGroup.classList[action]('dzvin-path-selected')
    }
  },

  _addPath: function (layer) {
    this._rootGroup.appendChild(layer._shadowPath)

    this._rootGroup.appendChild(layer._outlinePath)
    layer.addInteractiveTarget(layer._outlinePath)

    _addPath.call(this, layer)
  },

  _setPath: function (layer, path) {
    _setPath.call(this, layer, path)
    layer._outlinePath.setAttribute('d', path)
    layer._shadowPath.setAttribute('d', path)
  },

  _removePath: function (layer) {
    _removePath.call(this, layer)

    L.DomUtil.remove(layer._outlinePath)
    layer.removeInteractiveTarget(layer._outlinePath)

    L.DomUtil.remove(layer._shadowPath)

    layer.deleteMask && layer.deleteMask()
    layer.deleteAmplifierGroup && layer.deleteAmplifierGroup()
  },

  _updatePoly: function (layer, closed) {
    let result = L.SVG.pointsToPath(layer._rings, closed)
    const lineType = (layer.options && layer.options.lineType) || 'solid'
    const skipStart = layer.options && layer.options.skipStart
    const skipEnd = layer.options && layer.options.skipEnd
    const kind = layer.options && layer.options.tsType
    const length = layer._rings && layer._rings.length === 1 && layer._rings[0].length
    const fullPolygon = kind === entityKind.POLYGON && length >= 3
    const fullPolyline = kind === entityKind.POLYLINE && length >= 2
    const fullArea = kind === entityKind.AREA && length >= 3
    const fullCurve = kind === entityKind.CURVE && length >= 2
    if (kind === entityKind.SEGMENT && length === 2 && layer.options.tsTemplate) {
      const js = layer.options.tsTemplate
      if (js && js.svg && js.svg.path && js.svg.path[0] && js.svg.path[0].$ && js.svg.path[0].$.d) {
        result = prepareLinePath(js, js.svg.path[0].$.d, layer._rings[0])
      }
    } else if (fullPolygon) {
      switch (lineType) {
        case 'waved':
          result = this._buildWaved(layer, false, true)
          break
        default:
          break
      }
      this._updateMask(layer, false, true)
    } else if (fullPolyline) {
      switch (lineType) {
        case 'waved':
          result = this._buildWaved(layer, false, false)
          break
        default:
          break
      }
      this._updateMask(layer, false, false)
    } else if (fullArea) {
      result = prepareBezierPath(layer._rings[0], true)
      switch (lineType) {
        case 'waved':
          result = this._buildWaved(layer, true, true)
          break
        default:
          break
      }
      this._updateMask(layer, true, true)
    } else if (fullCurve) {
      result = prepareBezierPath(layer._rings[0], false, skipStart && length > 3, skipEnd && length > 3)
      switch (lineType) {
        case 'waved':
          result = this._buildWaved(layer, true, false)
          break
        default:
          break
      }
      this._updateMask(layer, true, false)
    }

    this._setPath(layer, result)
  },

  _updateMask: function (layer, bezier, locked) {
    const bounds = layer._map._renderer._bounds
    const insideMap = ({ x, y }) => x > bounds.min.x - AMPLIFIERS_SIZE && y > bounds.min.y - AMPLIFIERS_SIZE &&
      x < bounds.max.x + AMPLIFIERS_SIZE && y < bounds.max.y + AMPLIFIERS_SIZE
    const amplifiers = {
      rect: `<rect fill="white" x="${bounds.min.x}" y="${bounds.min.y}" width="${bounds.max.x - bounds.min.x}" height="${bounds.max.y - bounds.min.y}" />`,
      mask: '',
      group: '',
    }
    if (layer.options.lineAmpl === 'show-level' && layer.object && layer.object.level) {
      const amp = ampSigns[layer.object.level]
      const amplPoints = buildPeriodicPoints(AMPLIFIERS_STEP, -AMPLIFIERS_STEP / 2, layer._rings[0], bezier, locked,
        insideMap).filter(({ i, o }) => i && o)
      amplifiers.mask += amplPoints.map(({ x, y, r }) =>
        `<g transform="translate(${x},${y}) rotate(${r})">${amp.mask}</g>`
      ).join('')
      amplifiers.group += amplPoints.map(({ x, y, r }) =>
        `<g stroke-width="${AMPLIFIERS_STROKE_WIDTH}" fill="none" transform="translate(${x},${y}) rotate(${r})">${amp.sign}</g>`
      ).join('')
    }
    if (amplifiers.mask) {
      layer.getMask().innerHTML = `${amplifiers.rect}${amplifiers.mask}`
      layer._path.setAttribute('mask', `url(#mask-${layer.object.id})`)
    } else {
      layer.deleteMask && layer.deleteMask()
      layer._path.removeAttribute('mask')
    }
    if (amplifiers.group) {
      layer.getAmplifierGroup().innerHTML = amplifiers.group
    } else {
      layer.deleteAmplifierGroup && layer.deleteAmplifierGroup()
    }
  },

  _buildWaved: function (layer, bezier, locked) {
    const bounds = layer._map._renderer._bounds
    const insideMap = ({ x, y }) => x > bounds.min.x - WAVE_STEP && y > bounds.min.y - WAVE_STEP &&
      x < bounds.max.x + WAVE_STEP && y < bounds.max.y + WAVE_STEP
    const wavePoints = buildPeriodicPoints(WAVE_STEP, -WAVE_STEP, layer._rings[0], bezier, locked, insideMap)
    if (!wavePoints.length) {
      return 'M0 0'
    }
    let waves = `M${wavePoints[0].x} ${wavePoints[0].y}`
    const addLineTo = ({ x, y }) => {
      waves += ` L${x} ${y}`
    }
    const addWave = (p1, p2, addSize = true) => {
      const v = vector(p1, p2)
      const n = setLength(normal(v), WAVE_SIZE + (addSize ? WAVE_STEP - length(v) : 0))
      const cp1 = apply(p1, n)
      const cp2 = apply(p2, n)
      waves += ` C${cp1.x} ${cp1.y} ${cp2.x} ${cp2.y} ${p2.x} ${p2.y}`
    }
    for (let i = 1; i < wavePoints.length; i++) {
      if (!wavePoints[i].i) {
        addLineTo(wavePoints[i])
      } else {
        addWave(wavePoints[i - 1], wavePoints[i])
      }
    }
    if (DRAW_PARTIAL_WAVES && wavePoints.length > 0) {
      const p0 = wavePoints[wavePoints.length - 1]
      const p1 = layer._rings[0][layer._rings[0].length - 1]
      const rest = dist(p0, p1)
      if (rest >= 1) {
        if (locked) {
          addWave(p0, layer._rings[0][0], false)
        } else {
          const p2 = {
            x: p0.x + (p1.x - p0.x) / rest * WAVE_STEP,
            y: p0.y + (p1.y - p0.y) / rest * WAVE_STEP,
          }
          const l = Math.hypot(p0.n.x, p0.n.y)
          const cp1 = {
            x: p0.x - p0.n.x / l * WAVE_SIZE,
            y: p0.y - p0.n.y / l * WAVE_SIZE,
          }
          const cp2 = {
            x: p2.x + cp1.x - p0.x,
            y: p2.y + cp1.y - p0.y,
          }
          const b = new Bezier([ p0.x, p0.y, cp1.x, cp1.y, cp2.x, cp2.y, p2.x, p2.y ])
          const p = b.split(rest / WAVE_STEP).left.points
          waves += ` C${p[ 1 ].x} ${p[ 1 ].y} ${p[ 2 ].x} ${p[ 2 ].y} ${p[ 3 ].x} ${p[ 3 ].y}`
        }
      }
    }
    return `${waves}${locked ? ' Z' : ''}`
  },
})
