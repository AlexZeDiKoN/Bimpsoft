/* global L */
import Bezier from 'bezier-js'
import entityKind from '../entityKind'
import { prepareLinePath } from './utils/SVG'
import { prepareBezierPath } from './utils/Bezier'
import './SVG.css'

// ------------------------ Патч ядра Leaflet для візуалізації поліліній і полігонів засобами SVG ----------------------

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
    const { options: { shadowColor, opacity = 1, hidden, selected }, _shadowPath, _path, _outlinePath } = layer

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
      selected ? _path.classList.add('dzvin-path-selected') : _path.classList.remove('dzvin-path-selected')
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
    } else if (kind === entityKind.AREA && length >= 3) {
      result = prepareBezierPath(layer._rings[0], true)
      // this._updateMask(layer)
    } else if (kind === entityKind.CURVE && length >= 2) {
      result = prepareBezierPath(layer._rings[0], false, skipStart && length > 3, skipEnd && length > 3)
      this._updateMask(layer)
    }
    this._setPath(layer, result)
  },

  _updateMask: function (layer) {
    if (layer.options.lineAmpl === 'show-level') {
      const step = 100
      let sum = 0
      let offset = -step / 2
      const amplPoints = []
      for (let i = 0; i < layer._rings[0].length - 1; i++) {
        const b = new Bezier(
          layer._rings[0][i].x,
          layer._rings[0][i].y,
          layer._rings[0][i].cp2.x,
          layer._rings[0][i].cp2.y,
          layer._rings[0][i + 1].cp1.x,
          layer._rings[0][i + 1].cp1.y,
          layer._rings[0][i + 1].x,
          layer._rings[0][i + 1].y,
        )
        const length = b.length()
        sum += length
        if (length > 0) {
          let pos = offset + step
          while (pos < length) {
            const part = pos / length
            const amplPoint = b.get(part)
            const n = b.normal(part)
            amplPoint.n = Math.atan2(n.y, n.x) / Math.PI * 180
            pos += step
            amplPoints.push(amplPoint)
          }
          offset = pos - step - length
        }
      }
      console.log(amplPoints)
      console.log('length', sum)
      console.log('path', layer._rings[0])
      const mask = layer.getMask()
      mask.innerHTML = `<rect fill="white" x="0" y="0" width="100%" height="100%" />${
        amplPoints.map(({ x, y }) => `<circle cx="${x}" cy="${y}" r="${10}" fill="black" />`).join('')
      }`
      layer._path.setAttribute('mask', `url(#mask-${layer.object.id})`)
      const amplifierGroup = layer.getAmplifierGroup()
      amplifierGroup.innerHTML = amplPoints.map(({ x, y, n }) =>
        `<g transform="translate(${x},${y}) rotate(${n + 90})"><path d="m0,-8 v16" stroke-width="3" stroke="black"/></g>`
      ).join('')
    } else {
      layer.deleteMask && layer.deleteMask()
      layer.deleteAmplifierGroup && layer.deleteAmplifierGroup()
      layer._path.removeAttribute('mask')
    }
  },
})
