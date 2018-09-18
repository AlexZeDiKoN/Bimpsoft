/* global L */

import entityKind from '../../entityKind'
import { adjustSquareCorner } from '../utils/helpers'

const LPMDrawRectangle = L.PM.Draw.Rectangle

export default L.PM.Draw.Rectangle.extend({
  _syncRectangleSize: function () {
    if (this._layer.options.tsType === entityKind.SQUARE) {
      this._hintMarker.off('move', this._syncRectangleSize, this)
      this._hintMarker.setLatLng(adjustSquareCorner(this._hintMarker._map,
        this._hintMarker.getLatLng(), this._startMarker.getLatLng()))
      this._hintMarker.on('move', this._syncRectangleSize, this)
    }
    LPMDrawRectangle.prototype._syncRectangleSize.apply(this)
  },
})
