export const toSelection = (object) => {
  const { id, type, code, attributes, affiliation, unit, level, geometry } = object
  const coordinatesArray = geometry.toJS().map(({ lat, lng }) => ({ lng, lat }))
  return {
    id: +id,
    type: +type,
    code,
    amplifiers: attributes ? attributes.toJS() : attributes,
    affiliation,
    orgStructureId: unit,
    subordinationLevel: +level,
    coordinatesArray,
  }
}
