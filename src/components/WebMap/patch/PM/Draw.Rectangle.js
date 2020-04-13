import L from 'leaflet'
import entityKind from '../../entityKind'
import { adjustSquareCorner } from '../utils/helpers'

const { _syncRectangleSize } = L.PM.Draw.Rectangle.prototype
const parent = { _syncRectangleSize }

L.PM.Draw.Rectangle.include({
  _syncRectangleSize: function () {
    if (this._layer.options.tsType === entityKind.SQUARE) {
      this._hintMarker.off('move', this._syncRectangleSize, this)
      this._hintMarker.setLatLng(adjustSquareCorner(this._hintMarker._map,
        this._hintMarker.getLatLng(), this._startMarker.getLatLng()))
      this._hintMarker.on('move', this._syncRectangleSize, this)
    }
    parent._syncRectangleSize.call(this)
  },
})
