import { CRS, latLng } from 'leaflet'
import { sha256 } from 'js-sha256'
import { SHIFT_PASTE_LAT, SHIFT_PASTE_LNG } from '../constants/utils'

const shiftOne = (p, z) => {
  const f = CRS.EPSG4326.latLngToPoint(latLng(p), z)
  const x = f.x + SHIFT_PASTE_LNG
  const y = f.y + SHIFT_PASTE_LAT
  return CRS.EPSG4326.pointToLatLng({ x, y }, z)
}

const shift = (g, z) => Array.isArray(g)
  ? g.map((item) => shift(item, z))
  : shiftOne(g, z)

export const makeHash = (type, geometry) => sha256(JSON.stringify({
  type,
  geometry: geometry && [ ...geometry ].flat(4).map(({ lng, lat }) => ({
    lng: Math.trunc(lng * 10000),
    lat: Math.trunc(lat * 10000),
  })),
}))

export const getShift = (hashList, type, geometry, zoom) => {
  const checkHash = (g) => hashList.includes(makeHash(type, g))
    ? checkHash(shift(g, zoom))
    : g
  return hashList.length
    ? checkHash(geometry)
    : geometry
}

export function calcMiddlePoint (coords) {
  const zero = {
    lat: 0,
    lng: 0,
  }
  if (!coords.length) {
    return zero
  }
  const sum = coords.flat(3).reduce((a, p) => {
    a.lat += p.lat
    a.lng += p.lng
    return a
  }, zero)
  return {
    lat: sum.lat / coords.length,
    lng: sum.lng / coords.length,
  }
}

export const sub = ({ lat: lat1, lng: lng1 }, { lat: lat2, lng: lng2 }) => ({
  lat: lat2 - lat1,
  lng: lng2 - lng1,
})
