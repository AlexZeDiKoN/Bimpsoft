import L, { Draggable, DomUtil, Util } from 'leaflet'
import { setOpacity, setClassName, setShadowColor } from './utils/helpers'
import { calcShift } from './Generalization'

const { update, initialize, onAdd, _initIcon, _animateZoom, _removeIcon, setLatLng } = L.Marker.prototype
const parent = { update, initialize, onAdd, _initIcon, _animateZoom, _removeIcon, setLatLng }

const MarkerDrag = L.Handler.extend({
  initialize: function (marker) {
    this._marker = marker
  },

  addHooks: function () {
    const icon = this._marker._icon
    if (!this._draggable) {
      this._draggable = new Draggable(icon, icon, true)
    }
    this._draggable.on({
      dragstart: this._onDragStart,
      drag: this._onDrag,
      dragend: this._onDragEnd,
    }, this)
      .enable()
    DomUtil.addClass(icon, 'leaflet-marker-draggable')
  },

  removeHooks: function () {
    this._draggable.off({
      dragstart: this._onDragStart,
      drag: this._onDrag,
      dragend: this._onDragEnd,
    }, this)
      .disable()
    if (this._marker._icon) {
      DomUtil.removeClass(this._marker._icon, 'leaflet-marker-draggable')
    }
  },

  moved: function () {
    return this._draggable && this._draggable._moved
  },

  _onDragStart: function () {
    this._oldLatLng = this._marker.getLatLng()
    this._oldPx = this._marker._map.latLngToContainerPoint(this._oldLatLng)
    this._marker
      .closePopup()
      .fire('movestart')
      .fire('dragstart')
      .fire('pm:dragstart')
  },

  _onDrag: function (e) {
    const latlng = this._marker._map.containerPointToLatLng(this._oldPx.add(this._draggable._newPos))
    this._marker.setLatLng(latlng)
    e.latlng = latlng
    e.oldLatLng = this._oldLatLng
    this._marker
      .fire('move', e)
      .fire('drag', e)
      .fire('pm:drag', e)
  },

  _onDragEnd: function (e) {
    delete this._oldLatLng
    this._marker
      .fire('moveend')
      .fire('dragend', e)
      .fire('pm:dragend', e)
  },
})

const DzvinMarker = L.Marker.extend({
  setOpacity,

  setShadowColor,

  intersectsWithBounds: function (bounds) {
    return bounds.pad(0.5).contains(this.getLatLng())
  },

  setHidden: function (hidden) {
    this._hidden = hidden
    if (hidden) {
      this.removeFrom(this.map)
    } else {
      this.addTo(this.map)
    }
  },

  setSelected: function (selected, inActiveLayer) {
    if (this._selected !== selected || this._inActiveLayer !== inActiveLayer) {
      this._selected = selected
      this._inActiveLayer = inActiveLayer
      Util.setOptions(this, { selected, inActiveLayer })
      const el = this.getElement()
      setClassName(el, 'dzvin-marker-selected', selected && !inActiveLayer)
      setClassName(el, 'dzvin-marker-selected-on-active-layer', selected && inActiveLayer)
      !selected && setClassName(el, 'dzvin-marker-locked', false)
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

  setShowAmplifiers: function (showAmplifiers, shownAmplifiers) {
    const { icon } = this.options
    icon.options.showAmplifiers = showAmplifiers
    icon.options.shownAmplifiers = shownAmplifiers
  },

  _animateZoom: function (opt) {
    const { icon } = this.options
    icon.options.zoom = opt.zoom
    parent._animateZoom.call(this, opt)
  },

  _initIcon: function () {
    const { icon } = this.options
    icon.options.zoom = this._map.getZoom()
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

  _makeInteractive: function (node) {
    L.DomUtil.addClass(node, 'leaflet-interactive')
    this.addInteractiveTarget(node)
    Array.from(node.children).forEach(this._makeInteractive.bind(this))
  },

  _initInteraction: function () {
    if (!this.options.interactive) {
      return
    }

    this._makeInteractive(this._icon)

    let draggable = this.options.draggable
    if (this.dragging) {
      draggable = this.dragging.enabled()
      this.dragging.disable()
    }
    this.dragging = new MarkerDrag(this)
    if (draggable) {
      this.dragging.enable()
    }
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
      if (this._opacity !== undefined) {
        el.style.opacity = this._opacity
      }
      if (el.lastshadowColor !== this._shadowColor) {
        el.lastshadowColor = this._shadowColor
        el.style.setProperty('--outline-color', this._shadowColor || 'transparent')
      }

      setClassName(el, 'dzvin-marker-selected', this._selected && !this._inActiveLayer)
      setClassName(el, 'dzvin-marker-selected-on-active-layer', this._selected && this._inActiveLayer)
    }
  },

  setHighlighted: function (value) {
    const el = this.getElement()
    if (el) {
      if (value) {
        el.classList.add('dzvin-marker-locked')
      } else if (!this._locked) {
        el.classList.remove('dzvin-marker-locked')
      }
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
    this._pos = pos
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
        const offset = {
          x: Math.round(x - anchor.x * scale),
          y: Math.round(y - anchor.y * scale),
        }
        if (this._generalGroup) {
          const shift = calcShift(this._generalGroup, this)
          offset.x += shift.x
          offset.y += shift.y
        }
        L.DomUtil.setTransform(el, offset, scale)
        this._zIndex = y + this.options.zIndexOffset
        this._resetZIndex()
      }
    }
  },

  setLatLng: function (latLng) {
    parent.setLatLng.call(this, latLng)
    this._bounds = L.latLngBounds([ latLng ])
  },
})

export default DzvinMarker
