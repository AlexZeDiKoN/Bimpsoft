import L from 'leaflet'
import { LatLngBounds } from 'leaflet/src/geo/LatLngBounds'
import entityKind from '../../entityKind'
import { adjustSquareCorner } from '../utils/helpers'

const { _onMarkerDrag, _onMarkerDragEnd } = L.PM.Edit.Rectangle.prototype
const parent = { _onMarkerDrag, _onMarkerDragEnd }

L.PM.Edit.Rectangle.include({
  _onMarkerDrag: function (e) {
    // parent._onMarkerDrag.call(this, e) // Здається, цей виклик не потрібен, без нього працює так само
    const marker = e.target
    const kind = this._layer.options.tsType
    if (kind === entityKind.SQUARE) {
      let point = marker.getLatLng()
      const opposite = marker._oppositeCornerLatLng
      point = adjustSquareCorner(marker._map, point, opposite)
      this._layer.setBounds(L.latLngBounds(point, opposite))
      this._adjustAllMarkers(this._layer.getLatLngs()[0])
    } else {
      parent._onMarkerDrag.call(this, e) // потрібен для не SQUARE
    }
  },

  // от polygon + коррекция
  _onMarkerDragEnd: function (t) {
    var e = this._findCorners()
    this._adjustAllMarkers(e)
    this._cornerMarkers.forEach(function (t) { delete t._oppositeCornerLatLng })
    const bounds = new LatLngBounds(e)
    console.log('_onMarkerDragEnd polygon', { e, bounds })
    // this._layer.setBounds(bounds)
    this._layer.setBounds(e)
    this._layer.setLatLngs(e)
    this._layer.fire('pm:markerdragend', { markerEvent: t })
    this._fireEdit()
  },
})
