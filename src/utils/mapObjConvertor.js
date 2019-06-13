import { CRS, latLng } from 'leaflet'
import { ApiError } from '../constants/errors'
import i18n from '../i18n'
import { SHIFT_PASTE_LAT, SHIFT_PASTE_LNG } from '../constants/utils'

// todo: try do not use these converting

export const toSelection = (object) => {
  const { id, layer, type, code, attributes, affiliation, unit, level, geometry } = object
  const coordinatesArray = geometry.toJS().map(({ lat, lng }) => ({ lng, lat }))
  return {
    id: +id,
    type: +type,
    layer,
    code,
    amplifiers: attributes ? attributes.toJS() : attributes,
    affiliation,
    orgStructureId: unit,
    subordinationLevel: +level,
    coordinatesArray,
  }
}

const filterObj = (data) => {
  for (const key of Object.keys(data)) {
    if (data[key] === '') {
      delete data[key]
    }
  }
  return Object.keys(data).length ? data : null
}

export const fromSelection = (data) => {
  const { id, layer, type, code, amplifiers, orgStructureId, subordinationLevel, coordinates, coordinatesArray } = data
  let point = coordinates || (coordinatesArray && coordinatesArray[0])
  if (!point) {
    throw new ApiError(i18n.COORDINATES_UNDEFINED, i18n.ERROR)
  }
  point = { lng: parseFloat(point.lng), lat: parseFloat(point.lat) }
  const geometry = coordinatesArray
    ? coordinatesArray.map(({ lng, lat }) => ({ lng: parseFloat(lng), lat: parseFloat(lat) }))
    : [ point ]

  const object = {
    type,
    point,
    geometry,
    code,
    attributes: filterObj(amplifiers),
    level: subordinationLevel || 0,
    unit: orgStructureId || null,
    layer,
    affiliation: (code && Number(code.slice(3, 4))) || 0,
  }
  if (id) {
    object.id = id
  }
  return object
}

export const makeHash = (geometry) => {
  const { length } = geometry
  const def = { sumLat: 0, sumLng: 0, hash: 0 }
  const data = geometry.reduce((acc, point) => {
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
  const checkHash = (g) => {
    const hash = makeHash(g)
    if (hashList.includes(hash)) {
      const newGeometry = g.map((point) => {
        const currentFlat = CRS.Simple.latLngToPoint(latLng(point), zoom)
        const x = currentFlat.x + SHIFT_PASTE_LNG
        const y = currentFlat.y + SHIFT_PASTE_LAT
        return CRS.Simple.pointToLatLng({ x, y }, zoom)
      })
      return checkHash(newGeometry)
    }
    return g
  }
  return hashList.length ? checkHash(geometry) : geometry
}
