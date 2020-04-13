import L from 'leaflet'
import entityKind from '../../entityKind'

const { _syncHintLine } = L.PM.Draw.Line.prototype
const parent = { _syncHintLine }

L.PM.Draw.Line.include({
  _syncHintLine: function () {
    parent._syncHintLine.call(this)
    if (this._layer.options.tsType === entityKind.CURVE) {
      this._hintline.options.tsType = entityKind.CURVE
      this._hintline.options.skipStart = true
      const polyPoints = this._layer.getLatLngs()
      if (polyPoints.length > 2) {
        this._hintline.setLatLngs([
          polyPoints[polyPoints.length - 3],
          polyPoints[polyPoints.length - 2],
          polyPoints[polyPoints.length - 1],
          this._hintMarker.getLatLng(),
        ])
      } else if (polyPoints.length > 1) {
        this._hintline.setLatLngs([
          polyPoints[polyPoints.length - 2],
          polyPoints[polyPoints.length - 1],
          this._hintMarker.getLatLng(),
        ])
      }
    } else if (this._layer.options.tsType === entityKind.AREA) {
      this._hintline.options.tsType = entityKind.CURVE
      this._hintline.options.skipStart = true
      this._hintline.options.skipEnd = true
      const polyPoints = this._layer.getLatLngs()
      if (polyPoints.length > 2) {
        this._hintline.setLatLngs([
          polyPoints[polyPoints.length - 3],
          polyPoints[polyPoints.length - 2],
          polyPoints[polyPoints.length - 1],
          this._hintMarker.getLatLng(),
          polyPoints[0],
          polyPoints[1],
          polyPoints[2],
        ])
      } else if (polyPoints.length > 1) {
        this._hintline.setLatLngs([
          this._hintMarker.getLatLng(),
          polyPoints[polyPoints.length - 2],
          polyPoints[polyPoints.length - 1],
          this._hintMarker.getLatLng(),
          polyPoints[0],
          polyPoints[1],
          // this._hintMarker.getLatLng(),
        ])
      }
    }
  },
})
