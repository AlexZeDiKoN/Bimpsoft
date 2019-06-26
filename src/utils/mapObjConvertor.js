import { CRS, latLng } from 'leaflet'
import { sha256 } from 'js-sha256'
import { SHIFT_PASTE_LAT, SHIFT_PASTE_LNG } from '../constants/utils'

const shiftOne = (p, z) => {
  const f = CRS.EPSG4326.latLngToPoint(latLng(p), z)
  const x = f.x + SHIFT_PASTE_LNG
  const y = f.y + SHIFT_PASTE_LAT
  return CRS.EPSG4326.pointToLatLng({ x, y }, z)
}

const EQUATOR = 40075016.6855784

export const calcShiftWM = (latLng, zoom) => { // WM - Web Mercator (EPSG-3857)
  const scale = EQUATOR / CRS.EPSG3857.scale(zoom) // meter per pixel
  return {
    x: scale * SHIFT_PASTE_LNG,
    y: -scale * SHIFT_PASTE_LAT,
  }
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
  const arr = coords.flat(3)
  if (!arr.length) {
    return zero
  }
  const sum = arr.reduce((a, p) => {
    a.lat += p.lat
    a.lng += p.lng
    return a
  }, zero)
  return {
    lat: sum.lat / arr.length,
    lng: sum.lng / arr.length,
  }
}
