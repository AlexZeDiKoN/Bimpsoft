/* global L */

import { setOpacity, setHidden } from './utils/helpers'

const MIN_ZOOM = 0
const MAX_ZOOM = 20

const { update, _initIcon, _animateZoom } = L.Marker.prototype
const parent = { update, _initIcon, _animateZoom }

const getDropShadowByColor = (color) => `drop-shadow(0px 0px 10px ${color}) drop-shadow(0px 0px 10px ${color}) drop-shadow(0px 0px 15px ${color})`

const setShadowColor = function (shadowColor) {
  this._shadowColor = shadowColor
  const el = this.getElement()
  if (el) {
    el.style.filter = this._shadowColor ? getDropShadowByColor(this._shadowColor) : ''
  }
}

export default L.Marker.extend({

  setOpacity,
  setHidden,
  setShadowColor,
  setSelected: function (selected) {
    this._selected = selected
    const el = this.getElement()
    if (el) {
      const hasClassSelected = el.classList.contains('dzvin-marker-selected')
      if (hasClassSelected !== selected) {
        selected ? el.classList.add('dzvin-marker-selected') : el.classList.remove('dzvin-marker-selected')
      }
    }
  },
  setScaleOptions: function (scaleOptions) {
    const { pointSizes } = scaleOptions
    this._pointSizes = pointSizes
    this._zoom = this._calcPointSize(this._map.getZoom())
    this.update()
  },
  _calcPointSize: function (zoom) {
    const { min = 1, max = 200 } = this._pointSizes || {}
    const result = zoom <= MIN_ZOOM
      ? min
      : zoom >= MAX_ZOOM
        ? max
        : (1 / (2 - (zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM) * 1.5) - 0.5) / 1.5 * (max - min) + min
    return Math.round(result)
  },
  _animateZoom: function (opt) {
    const correctedZoom = this._calcPointSize(opt.zoom)
    this._zoom = correctedZoom
    parent._animateZoom.call(this, opt)
  },
  _initIcon: function () {
    parent._initIcon.call(this)
    const el = this.getElement()
    el.classList.add('dzvin-marker')
  },
  update: function () {
    parent.update.call(this)
    const el = this.getElement()
    if (el) {
      el.style.display = this._hidden ? 'none' : ''
      if (this._opacity !== undefined) {
        el.style.opacity = this._opacity
      }
      if (this.lastshadowColor !== this._shadowColor) {
        this.lastshadowColor = this._shadowColor
        el.style.filter = this._shadowColor ? getDropShadowByColor(this._shadowColor) : ''
      }

      const hasClassSelected = el.classList.contains('dzvin-marker-selected')
      if (hasClassSelected !== this._selected) {
        this._selected ? el.classList.add('dzvin-marker-selected') : el.classList.remove('dzvin-marker-selected')
      }
    }
  },

  _setPos: function (pos) {
    const { x, y } = pos
    const zoom = this._zoom
    if (!this._lastPos || this._lastPos.x !== x || this._lastPos.y !== y || this._lastPos.zoom !== zoom) {
      const scale = this._zoom / 100

      this._lastPos = { x, y, zoom }
      const { anchor } = this.options.icon.options
      L.DomUtil.setTransform(this._icon, {x: x - anchor.x * scale, y: y - anchor.y * scale}, scale)
      this._zIndex = y + this.options.zIndexOffset
      this._resetZIndex()
    }
  },
})
