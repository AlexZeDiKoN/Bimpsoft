import L from 'leaflet'

const { enableLayerDrag, _dragMixinOnMouseMove, _dragMixinOnMouseUp } = L.PM.Edit.prototype

L.PM.Edit.FlexGrid.prototype.enableLayerDrag = function () {
  this._layer._pathes.forEach((el) => L.DomUtil.addClass(el, 'leaflet-pm-draggable'))
  return enableLayerDrag.call(this)
}

L.PM.Edit.FlexGrid.prototype._onLayerDrag = function (e) {
  const { latlng } = e
  const deltaLatLng = {
    lat: latlng.lat - this._tempDragCoord.lat,
    lng: latlng.lng - this._tempDragCoord.lng,
  }
  const moveCoords = (coords) => coords.map((currentLatLng) => Array.isArray(currentLatLng)
    ? moveCoords(currentLatLng)
    : L.latLng(currentLatLng.lat + deltaLatLng.lat, currentLatLng.lng + deltaLatLng.lng))
  this._layer.eternals = moveCoords(this._layer.eternals)
  this._layer.directionSegments = moveCoords(this._layer.directionSegments)
  this._layer.zoneSegments = moveCoords(this._layer.zoneSegments)
  this._layer.redraw()
  this._tempDragCoord = latlng
  this._layer.fire('pm:drag')
}

L.PM.Edit.FlexGrid.prototype._dragMixinOnDisable = function () {
  this._layer._pathes.forEach((el) => L.DomUtil.removeClass(el, 'leaflet-pm-draggable'))
}

L.PM.Edit.FlexGrid.prototype._dragMixinOnMouseMove = function (e) {
  _dragMixinOnMouseMove.call(this, e)
  this._layer.pm._deleteMainMarkers()
  this._layer.pm._deleteResizeMarkers()
}

L.PM.Edit.FlexGrid.prototype._dragMixinOnMouseUp = function (e) {
  _dragMixinOnMouseUp.call(this, e)
  this._layer.pm._initMarkers()
}
