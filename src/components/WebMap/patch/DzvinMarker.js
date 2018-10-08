/* global L */

import { setOpacity, setHidden } from './utils/helpers'
import UpdateQueue from './UpdateQueue'

const MIN_ZOOM = 0
const MAX_ZOOM = 20

const { update, initialize, _initIcon, _animateZoom, _removeIcon } = L.Marker.prototype
const parent = { update, initialize, _initIcon, _animateZoom, _removeIcon }

const getDropShadowByColor = (color) => `drop-shadow(0px 0px 10px ${color}) drop-shadow(0px 0px 10px ${color}) drop-shadow(0px 0px 15px ${color})`

const setShadowColor = function (shadowColor) {
  this._shadowColor = shadowColor
  const el = this.getElement()
  if (el) {
    el.style.filter = this._shadowColor ? getDropShadowByColor(this._shadowColor) : ''
  }
}
const calcPointSize = (zoom, pointSizes) => {
  const { min = 1, max = 200 } = pointSizes || {}
  const result = zoom <= MIN_ZOOM
    ? min
    : zoom >= MAX_ZOOM
      ? max
      : (1 / (2 - (zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM) * 1.5) - 0.5) / 1.5 * (max - min) + min
  return Math.round(result)
}

const updater = new UpdateQueue()

const DzvinMarker = L.Marker.extend({
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
  recreateIcon: function () {
    const marker = this
    const { icon } = marker.options
    icon.options.zoom = marker._zoom
    marker._initIcon()
    marker.update()
  },
  setScaleOptions: function (scaleOptions) {
    const { pointSizes } = scaleOptions
    this._pointSizes = pointSizes
    this._zoom = calcPointSize(this._map.getZoom(), this._pointSizes)
    this.update()
    updater.addToUpdateQueue(this)
  },
  setShowAmplifiers: function (showAmplifiers) {
    this._showAmplifiers = showAmplifiers
    updater.addToUpdateQueue(this)
  },
  _animateZoom: function (opt) {
    this._zoom = calcPointSize(opt.zoom, this._pointSizes)
    parent._animateZoom.call(this, opt)
    updater.addToUpdateQueue(this)
  },
  _initIcon: function () {
    parent._initIcon.call(this)
    const el = this.getElement()
    el.style.willChange = 'transform'
    el.classList.add('dzvin-marker')
  },
  _initInteraction: function () {
    if (!this.options.interactive) {
      return
    }

    Array.from(this._icon.children).forEach((child) => {
      L.DomUtil.addClass(child, 'leaflet-interactive')
      this.addInteractiveTarget(child)
    })
  },
  _removeIcon: function () {
    if (this._icon) {
      updater.removeFromUpdateQueue(this)
      Array.from(this._icon.children).forEach((child) => {
        this.removeInteractiveTarget(child)
      })
    }
    parent._removeIcon.call(this)
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
    const lastPos = this._icon._lastPos
    if (!lastPos || lastPos.x !== x || lastPos.y !== y || lastPos.zoom !== zoom) {
      const { anchor, size = 100 } = this._icon
      const scale = this._zoom / size
      this._icon._lastPos = { x, y, zoom }
      L.DomUtil.setTransform(this._icon, { x: x - anchor.x * scale, y: y - anchor.y * scale }, scale)
      this._zIndex = y + this.options.zIndexOffset
      this._resetZIndex()
    }
  },
})

DzvinMarker.updater = updater

export default DzvinMarker
