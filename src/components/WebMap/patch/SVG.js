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

const ampSigns = subordinationLevels.list.reduce((res, { value }) => ({
  ...res,
  [value]: extractSubordinationLevelSVG(value, AMPLIFIERS_SIZE, AMPLIFIERS_WINDOW_MARGIN),
}), {})

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
    y: this.vector.x,
  })
}

const buildAmplifierPoints = (points, bezier, locked, insideMap) => {
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
  const step = AMPLIFIERS_STEP
  let offset = -step / 2
  const amplPoints = []
  const last = points.length - Number(!locked)
  for (let i = 0; i < last; i++) {
    const segment = bezier
      ? new Bezier(...bezierArray(points, i))
      : new Segment(...lineArray(points, i))
    const length = segment.length()
    if (length > 0) {
      let pos = offset + step
      while (pos < length) {
        const part = pos / length
        const amplPoint = segment.get(part)
        const n = segment.normal(part)
        amplPoint.n = (Math.atan2(n.y, n.x) / Math.PI + 0.5) * 180;
        (i < last - 1 || length - pos > step / 5) && insideMap(amplPoint) && amplPoints.push(amplPoint)
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
    const skipStart = layer.options && layer.options.skipStart
    const skipEnd = layer.options && layer.options.skipEnd
    const kind = layer.options && layer.options.tsType
    const length = layer._rings && layer._rings.length === 1 && layer._rings[0].length
    if (kind === entityKind.SEGMENT && length === 2 && layer.options.tsTemplate) {
      const js = layer.options.tsTemplate
      if (js && js.svg && js.svg.path && js.svg.path[0] && js.svg.path[0].$ && js.svg.path[0].$.d) {
        result = prepareLinePath(js, js.svg.path[0].$.d, layer._rings[0])
      }
    } else if (kind === entityKind.POLYGON && length >= 3) {
      this._updateMask(layer, false, true)
    } else if (kind === entityKind.POLYLINE && length >= 2) {
      this._updateMask(layer, false, false)
    } else if (kind === entityKind.AREA && length >= 3) {
      result = prepareBezierPath(layer._rings[0], true)
      this._updateMask(layer, true, true)
    } else if (kind === entityKind.CURVE && length >= 2) {
      result = prepareBezierPath(layer._rings[0], false, skipStart && length > 3, skipEnd && length > 3)
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
      const amplPoints = buildAmplifierPoints(layer._rings[0], bezier, locked, insideMap)
      amplifiers.mask += amplPoints.map(({ x, y, n }) =>
        `<g transform="translate(${x},${y}) rotate(${n})">${amp.mask}</g>`
      ).join('')
      amplifiers.group += amplPoints.map(({ x, y, n }) =>
        `<g stroke-width="${AMPLIFIERS_STROKE_WIDTH}" fill="none" transform="translate(${x},${y}) rotate(${n})">${amp.sign}</g>`
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
})
