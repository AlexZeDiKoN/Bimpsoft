import L from 'leaflet'
import entityKind from '../entityKind'
const { _simplifyPoints } = L.Polyline.prototype

L.Polyline.include({
  _simplifyPoints: function () {
    const kind = this.options && this.options.tsType
    if (kind !== entityKind.AREA && kind !== entityKind.CURVE) {
      _simplifyPoints.call(this)
    }
  },
})
