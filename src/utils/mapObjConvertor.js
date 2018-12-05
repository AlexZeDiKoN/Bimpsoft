import { ApiError } from '../constants/errors'
import i18n from '../i18n'

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
