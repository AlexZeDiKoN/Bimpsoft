import L from 'leaflet'

const { _createMiddleMarker, _createMarker } = L.PM.Edit.Line.prototype
const parent = { _createMiddleMarker, _createMarker }

L.PM.Edit.Sophisticated = L.PM.Edit.Line.extend({
  _createMarker: function (latlng, index) {
    const allowDelete = this._layer.lineDefinition.allowDelete(index, this._layer._latlngs.length)
    if (!allowDelete) {
      this.options.preventMarkerRemoval = true
    }
    const marker = parent._createMarker.call(this, latlng, index)
    if (!allowDelete) {
      L.DomUtil.addClass(marker._icon, 'protected')
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
