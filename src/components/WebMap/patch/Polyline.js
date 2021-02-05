import L from 'leaflet'
import entityKind from '../entityKind'
const { _simplifyPoints } = L.Polyline.prototype
const { setLatLngs } = L.Rectangle.prototype

L.Polyline.include({
  _simplifyPoints: function () {
    const kind = this.options && this.options.tsType
    if (kind !== entityKind.AREA && kind !== entityKind.CURVE) {
      _simplifyPoints.call(this)
    }
  },
})

L.Rectangle.include({
  setLatLngs: function (latlangs) {
    console.log('setLatLangs Rectangle', latlangs)
    setLatLngs.call(this, latlangs)
  },
})
