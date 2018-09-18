/* global L */

import entityKind from '../../entityKind'
import { adjustSquareCorner } from '../utils/helpers'

const LPMEditRectangle = L.PM.Edit.Rectangle

export default L.PM.Edit.Rectangle.extend({
  _onMarkerDrag: function (e) {
    LPMEditRectangle.prototype._onMarkerDrag.apply(this, e) // Здається, цей виклик не потрібен, без нього працює так само
    const marker = e.target
    const kind = this._layer.options.tsType
    if (kind === entityKind.SQUARE) {
      let point = marker.getLatLng()
      const opposite = marker._oppositeCornerLatLng
      point = adjustSquareCorner(marker._map, point, opposite)
      this._layer.setBounds(L.latLngBounds(point, opposite))
      this._adjustAllMarkers(this._layer.getLatLngs()[0])
    }
  },
})
