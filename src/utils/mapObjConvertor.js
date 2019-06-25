import { CRS, latLng } from 'leaflet'
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

export const makeHash = (geometry) => {
  const { length } = geometry
  const def = { sumLat: 0, sumLng: 0, hash: 0 }
  const data = geometry.flat(3).reduce((acc, point) => {
    const lat = Math.trunc(point.lat * 10000)
    const lng = Math.trunc(point.lng * 10000)
    const sumLat = acc.sumLat + lat
    const sumLng = acc.sumLng + lng
    const hash = acc.hash + lat + lng
    return { sumLat, sumLng, hash }
  }, def)
  const { sumLat, sumLng, hash } = data
  const weightPoint = { x: Math.trunc(sumLat / length / length), y: Math.trunc(sumLng / length / length) }
  return Number(`${length}${hash}${weightPoint.x}${weightPoint.y}`)
}

export const getShift = (hashList, geometry, zoom) => {
  const checkHash = (g) => hashList.includes(makeHash(g))
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
  const sum = coords.reduce((a, p) => {
    a.lat += p.lat
    a.lng += p.lng
    return a
  }, zero)
  return {
    lat: sum.lat / coords.length,
    lng: sum.lng / coords.length,
  }
}
