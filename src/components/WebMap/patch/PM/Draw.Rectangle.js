import L from 'leaflet'
import entityKind from '../../entityKind'
import { adjustSquareCorner } from '../utils/helpers'

const { _syncRectangleSize } = L.PM.Draw.Rectangle.prototype
const parent = { _syncRectangleSize }

L.PM.Draw.Rectangle.include({
  _syncRectangleSize: function () {
    if (this._layer.options.tsType === entityKind.SQUARE) {
      const hintM = this._hintMarker
      hintM.off('move', this._syncRectangleSize, this) // блокировка циклического вызова

      hintM.setLatLng(adjustSquareCorner(hintM._map, hintM.getLatLng(), this._startMarker.getLatLng()))
      parent._syncRectangleSize.call(this)

      hintM.on('move', this._syncRectangleSize, this)
    } else {
      parent._syncRectangleSize.call(this)
    }
  },

})
