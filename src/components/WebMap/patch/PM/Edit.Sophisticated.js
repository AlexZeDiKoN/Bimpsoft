import L from 'leaflet'

const { _createMiddleMarker, _createMarker } = L.PM.Edit.Line.prototype
const parent = { _createMiddleMarker, _createMarker }

L.PM.Edit.include({
  isPolygon() {
    // if it's a polygon, it means the coordinates array is multi dimensional
    return this._layer instanceof L.Polygon || (this._layer.lineDefinition && this._layer.lineDefinition.isPolygon)
  },

  isArea() {
    return this._layer?.lineDefinition?.isArea
  }
})

L.PM.Edit.Sophisticated = L.PM.Edit.Line.extend({
  _getMarkersArray: function () {
    return this._markers
  },

  _getMarkersCount: function () {
    return this._markers.length
  },

  _createMarker: function (latlng, index) {
    const preventDelete = index === undefined ||
      !this._layer.lineDefinition.allowDelete(index, this._layer._latlngs.length)
    const marker = parent._createMarker.call(this, latlng, index)
    if (preventDelete) {
      L.DomUtil.addClass(marker._icon, 'protected')
    } else {
      marker.on('contextmenu', this._removeMarker, this)
    }
    return marker
  },

  _createMiddleMarker: function (leftM, rightM) {
    if (leftM && rightM) {
      const marker = parent._createMiddleMarker.call(this, leftM, rightM)
      const check = this._layer.lineDefinition.allowMiddle(leftM._index, rightM._index, this._layer._latlngs.length, this._layer)
      if (typeof check === 'object') {
        marker.setLatLng(check)
      } else if (!check) {
        this._markerGroup.removeLayer(marker)
      }
      return marker
    }
  },
})

function initSophisticated () {
  if (!this.options.pmIgnore) {
    this.pm = new L.PM.Edit.Sophisticated(this)
  }
}

L.Sophisticated.addInitHook(initSophisticated)
