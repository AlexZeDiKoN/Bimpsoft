/* global L */

const { enable } = L.PM.Edit.Marker.prototype
const parent = { enable }

L.PM.Edit.Marker.include({
  enable: function (options) {
    parent.enable.call(this, options)
    this._layer.off('contextmenu', this._removeMarker, this)
    this._editMarker = this._createMarker(this._layer.getLatLng())
    this._editMarker.addTo(this._map)
  },

  disable: function () {
    this._enabled = false
    this._layer.dragging && this._layer.dragging.disable()
    this._layerEdited = false
    this._editMarker && this._editMarker.remove()
  },

  _createMarker: function (latlng) {
    const marker = new L.Marker(latlng, {
      draggable: true,
      icon: L.divIcon({ className: 'marker-icon' }),
    })
    marker._pmTempLayer = true
    marker.on('move', this._onMarkerDrag, this)
    return marker
  },

  _onMarkerDrag: function (e) {
    this._layer.setLatLng(e.target.getLatLng())
  },
})
