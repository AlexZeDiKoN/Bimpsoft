/* global L */

import { dblClickOnControlPoint } from '../utils/helpers'
import { mouseupTimer } from './constants'

const LPMEditMarker = L.PM.Edit.Marker

export default L.PM.Edit.Marker.extend({
  enable: function (options) {
    LPMEditMarker.prototype.enable.call(this, options)
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
    marker.on('dblclick', dblClickOnControlPoint)
    marker.on('move', this._onMarkerDrag, this)
    marker.on('mousedown', () => (marker._map.pm.draggingMarker = true))
    marker.on('mouseup', () => setTimeout(() => {
      if (marker._map) {
        marker._map.pm.draggingMarker = false
      }
    }, mouseupTimer))
    return marker
  },

  _onMarkerDrag: function (e) {
    this._layer.setLatLng(e.target.getLatLng())
  },
})
