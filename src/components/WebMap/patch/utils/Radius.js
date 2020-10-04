import L from 'leaflet'

L.CRS.Earth = L.Util.extend(L.CRS.Earth, {
  calcPairRight: function (latLng, distance) {
    const rad = Math.PI / 180
    const hsDR = Math.sin(distance / this.R / 2)
    const cosPhi = Math.cos(latLng.lat * rad)
    const a = hsDR * hsDR / (cosPhi * cosPhi)
    const c = Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return L.latLng({
      lat: latLng.lat,
      lng: latLng.lng + (2 * c) / rad,
    })
  },
  calcPairDown: function (latLng, distance) {
    const rad = Math.PI / 180
    return L.latLng({
      lat: latLng.lat - distance / this.R / rad,
      lng: latLng.lng,
    })
  },
  calcPairRightDown: function (latLng, distance) {
    const r = this.calcPairRight(latLng, distance)
    const d = this.calcPairDown(latLng, distance)
    return L.latLng({
      lat: d.lat,
      lng: r.lng,
    })
  },
  calcPairUp: function (latLng, distance) {
    const rad = Math.PI / 180
    return L.latLng({
      lat: latLng.lat + distance / this.R / rad,
      lng: latLng.lng,
    })
  },
  calcPairLeft: function (latLng, distance) {
    const rad = Math.PI / 180
    const hsDR = Math.sin(distance / this.R / 2)
    const cosPhi = Math.cos(latLng.lat * rad)
    const a = hsDR * hsDR / (cosPhi * cosPhi)
    const c = Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return L.latLng({
      lat: latLng.lat,
      lng: latLng.lng - (2 * c) / rad,
    })
  },
  calcPairLeftUp: function (latLng, distance) {
    const r = this.calcPairLeft(latLng, distance)
    const d = this.calcPairUp(latLng, distance)
    return L.latLng({
      lat: d.lat,
      lng: r.lng,
    })
  },
  calcPairLeftDown: function (latLng, distance) {
    const r = this.calcPairLeft(latLng, distance)
    const d = this.calcPairDown(latLng, distance)
    return L.latLng({
      lat: d.lat,
      lng: r.lng,
    })
  },
  calcPairRightUp: function (latLng, distance) {
    const r = this.calcPairRight(latLng, distance)
    const d = this.calcPairUp(latLng, distance)
    return L.latLng({
      lat: d.lat,
      lng: r.lng,
    })
  },
})
