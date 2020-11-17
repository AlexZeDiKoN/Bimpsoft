import { utils } from '@C4/CommonComponents'
import i18n from '../../i18n'
import { ValidationError } from '../../constants/errors'

const { Coordinates: Coord } = utils

export function validateCoordinate (coordinate) {
  if (!Coord.check(coordinate)) {
    throw new ValidationError(i18n.INCORRECT_COORDINATE)
  }
}

export function validateCoordinates (geometry, size) {
  if (!geometry || !geometry.length || geometry.length < size) {
    throw new ValidationError(i18n.INCORRECT_COORDINATE)
  }
  for (const coordinate of geometry) {
    validateCoordinate(coordinate)
  }
}
