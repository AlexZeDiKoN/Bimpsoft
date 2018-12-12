/* global L */

import { setOpacity, setHidden, setClassName } from './utils/helpers'

const { update, initialize, onAdd, _initIcon, _animateZoom, _removeIcon } = L.Marker.prototype
const parent = { update, initialize, onAdd, _initIcon, _animateZoom, _removeIcon }

const getDropShadowByColor = (color) => `drop-shadow(0px 0px 2px ${color}) drop-shadow(0px 0px 2px ${color}) drop-shadow(0px 0px 3px ${color})`

const setShadowColor = function (shadowColor) {
  this._shadowColor = shadowColor
  const el = this.getElement()
  if (el) {
    el.style.filter = this._shadowColor ? getDropShadowByColor(this._shadowColor) : ''
  }
}

const DzvinMarker = L.Marker.extend({
  setOpacity,
  setHidden,
  setShadowColor,
  setSelected: function (selected, inActiveLayer) {
    if (this._selected !== selected || this._inActiveLayer !== inActiveLayer) {
      this._selected = selected
      this._inActiveLayer = inActiveLayer
      const el = this.getElement()
      setClassName(el, 'dzvin-marker-selected', selected && !inActiveLayer)
      setClassName(el, 'dzvin-marker-selected-on-active-layer', selected && inActiveLayer)
    }
  },
  optimize: function () {
    const { icon } = this.options
    if (icon.shouldRecreate(this.getElement())) {
      this._reinitIcon()
      this.update()
      return true
    }
    return false
  },
  setScaleOptions: function (scaleOptions) {
    const { icon } = this.options
    icon.options.scaleOptions = scaleOptions
    this.update()
  },
  setShowAmplifiers: function (showAmplifiers) {
    const { icon } = this.options
    icon.options.showAmplifiers = showAmplifiers
  },
  _animateZoom: function (opt) {
    const { icon } = this.options
    icon.options.zoom = opt.zoom
    parent._animateZoom.call(this, opt)
  },
  _initIcon: function () {

  },
  onAdd: function (map) {
    const { icon } = this.options
    icon.options.zoom = map.getZoom()
    parent.onAdd.call(this, map)
  },
  _reinitIcon: function () {
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
      Array.from(this._icon.children).forEach((child) => {
        this.removeInteractiveTarget(child)
      })
      parent._removeIcon.call(this)
    }
  },
  update: function () {
    parent.update.call(this)
    const el = this.getElement()
    if (el) {
      el.style.display = this._hidden ? 'none' : ''
      if (this._opacity !== undefined) {
        el.style.opacity = this._opacity
      }
      if (el.lastshadowColor !== this._shadowColor) {
        el.lastshadowColor = this._shadowColor
        el.style.filter = this._shadowColor ? getDropShadowByColor(this._shadowColor) : ''
      }

      setClassName(el, 'dzvin-marker-selected', this._selected && !this._inActiveLayer)
      setClassName(el, 'dzvin-marker-selected-on-active-layer', this._selected && this._inActiveLayer)
    }
  },
  setLocked: function (locked) {
    this._locked = locked
    const el = this.getElement()
    if (el) {
      const hasClassLocked = el.classList.contains('dzvin-marker-locked')
      if (hasClassLocked !== locked) {
        if (locked) {
          el.classList.add('dzvin-marker-locked')
        } else {
          el.classList.remove('dzvin-marker-locked')
        }
      }
    }
  },
  _setPos: function (pos) {
    const el = this.getElement()
    if (el) {
      const { x, y } = pos
      const { icon } = this.options
      const { scaleOptions } = icon.options
      const posState = el.posState
      const isPosChanged =
        !posState ||
        posState.x !== x ||
        posState.y !== y ||
        posState.zoom !== this._map.getZoom() ||
        posState.scaleOptions !== scaleOptions
      if (isPosChanged) {
        this._lastPos = { x, y }
        const { anchor, scale: iconScale } = el.state
        const currentScale = icon.getScale(this._map.getZoom(), scaleOptions)
        const scale = currentScale / iconScale
        L.DomUtil.setTransform(el, { x: x - anchor.x * scale, y: y - anchor.y * scale }, scale)
        this._zIndex = y + this.options.zIndexOffset
        this._resetZIndex()
      }
    }
  },
})

export default DzvinMarker
