import L from 'leaflet'

import './Map.BoxSelect.css'

/*
 * L.Handler.BoxSelect is used to select objects in rect with ctrl-drag interaction to the map
 * (selecting bounding box), enabled by default.
 */

const DELTA_MOVE = 3

// @namespace Map
// @section Interaction Options
L.Map.mergeOptions({
  // @option boxSelect: Boolean = true
  // Whether the map can select objects in a rectangular area specified by
  // dragging the mouse while pressing the ctrl key.
  boxSelect: true,
})

const BoxSelect = L.Handler.extend({
  initialize: function (map) {
    this._map = map
    this._container = map._container
    this._pane = map._panes.overlayPane
    this._resetStateTimeout = 0
    map.on('unload', this._destroy, this)
  },

  addHooks: function () {
    L.DomEvent.on(this._container, 'mousedown', this._onMouseDown, this)
  },

  removeHooks: function () {
    L.DomEvent.off(this._container, 'mousedown', this._onMouseDown, this)
  },

  moved: function () {
    return this._moved
  },

  _destroy: function () {
    L.DomUtil.remove(this._pane)
    delete this._pane
  },

  _resetState: function () {
    this._resetStateTimeout = 0
    this._moved = false
  },

  _clearDeferredResetState: function () {
    if (this._resetStateTimeout !== 0) {
      clearTimeout(this._resetStateTimeout)
      this._resetStateTimeout = 0
    }
  },

  _onMouseDown: function (e) {
    if (!e.ctrlKey || ((e.which !== 1) && (e.button !== 1))) {
      return false
    }

    // Clear the deferred resetState if it hasn't executed yet, otherwise it
    // will interrupt the interaction and orphan a box element in the container.
    this._clearDeferredResetState()
    this._resetState()

    this._map.dragging.disable()
    L.DomUtil.disableTextSelection()
    L.DomUtil.disableImageDrag()

    this._startPoint = this._map.mouseEventToContainerPoint(e)

    L.DomEvent.on(document, {
      contextmenu: L.DomEvent.stop,
      mousemove: this._onMouseMove,
      click: this._onMouseUp,
      keydown: this._onKeyDown,
    }, this)
  },

  _onMouseMove: function (e) {
    this._point = this._map.mouseEventToContainerPoint(e)

    if (!this._moved) {
      const dx = this._startPoint.x - this._point.x
      const dy = this._startPoint.y - this._point.y
      if (dx * dx + dy * dy > DELTA_MOVE * DELTA_MOVE) {
        this._moved = true

        this._box = L.DomUtil.create('div', 'leaflet-zoom-box leaflet-select-box', this._container)
        L.DomUtil.addClass(this._container, 'leaflet-crosshair')

        this._map.fire('boxselectstart')
      } else {
        return
      }
    }

    const bounds = new L.Bounds(this._point, this._startPoint)
    const size = bounds.getSize()

    L.DomUtil.setPosition(this._box, bounds.min)

    this._box.style.width = size.x + 'px'
    this._box.style.height = size.y + 'px'
  },

  _finish: function () {
    if (this._moved) {
      L.DomUtil.remove(this._box)
      L.DomUtil.removeClass(this._container, 'leaflet-crosshair')
    }

    L.DomUtil.enableTextSelection()
    L.DomUtil.enableImageDrag()

    L.DomEvent.off(document, {
      contextmenu: L.DomEvent.stop,
      mousemove: this._onMouseMove,
      click: this._onMouseUp,
      keydown: this._onKeyDown,
    }, this)

    this._map.dragging.enable()
  },

  _onMouseUp: function (e) {
    if ((e.which !== 1) && (e.button !== 1)) {
      return
    }

    this._finish()

    if (!this._moved) {
      return
    }
    L.DomEvent.stopPropagation(e)
    // Postpone to next JS tick so internal click event handling
    // still see it as "moved".
    this._clearDeferredResetState()
    this._resetStateTimeout = setTimeout(L.Util.bind(this._resetState, this), 0)

    const bounds = new L.LatLngBounds(
      this._map.containerPointToLatLng(this._startPoint),
      this._map.containerPointToLatLng(this._point),
    )

    this._map
      .fire('boxselectend', { boxSelectBounds: bounds })
  },

  _onKeyDown: function (e) {
    if (e.keyCode === 27) {
      this._finish()
    }
  },
})

// @section Handlers
// @property boxZoom: Handler
// Box (shift-drag with mouse) zoom handler.
L.Map.addInitHook('addHandler', 'boxSelect', BoxSelect)
