import L from 'leaflet'

import DragMixin from './Mixins/Drag.GeoJSON'

L.PM.Edit.GeoJSON = L.PM.Edit.extend({
  includes: [ DragMixin ],

  initialize (layer) {
    this._layer = layer
    this._enabled = false
  },

  toggleEdit (options) {
    if (!this.enabled()) {
      this.enable(options)
    } else {
      this.disable()
    }
  },

  enable (options) {
    L.Util.setOptions(this, options)
    this._map = this._layer._map
    if (!this._map) {
      return
    }
    if (this.enabled()) {
      this.disable()
    }
    this._enabled = true
    this._layer.on('remove', this._onLayerRemove, this)
    if (this.options.draggable) {
      this.enableLayerDrag()
    }
  },

  _onLayerRemove (e) {
    this.disable(e.target)
  },

  enabled () {
    return this._enabled
  },

  disable (layer = this._layer) {
    if (!this.enabled()) {
      return false
    }
    if (layer.pm._dragging) {
      return false
    }
    layer.pm._enabled = false
    this._layer.off('remove', this._onLayerRemove)
    if (this.options.draggable) {
      this.disableLayerDrag()
    }
    return true
  },

  _fireEdit () {
    this._layer.fire('pm:edit')
  },
})

function initGeoJSON () {
  if (!this.options.pmIgnore) {
    this.pm = new L.PM.Edit.GeoJSON(this)
  }
}

L.GeoJSON.addInitHook(initGeoJSON)
