import SelectionTypes from '../../constants/SelectionTypes'
import i18n from '../../i18n'
import { ValidationError } from '../../constants/errors'
import { validateCoordinate, validateCoordinates } from './coordinates'
import { validateTexts } from './texts'
import { validateMilsymbol } from './milsymbol'

export function validateObject (object) {
  if (!object || !object.type) {
    throw new ValidationError(i18n.ERROR_UNDEFINET_OBJECT_TYPE)
  }
  validateCoordinate(object.point)
  switch (object.type) {
    case SelectionTypes.TEXT:
      validateTexts(object.attributes.texts)
      validateCoordinates(object.geometry, 1)
      break
    case SelectionTypes.POINT:
      validateMilsymbol(object.code, object.attributes)
      validateCoordinates(object.geometry, 1)
      break
    case SelectionTypes.POLYGON:
    case SelectionTypes.AREA:
      validateCoordinates(object.geometry, 3)
      break
    default:
      validateCoordinates(object.geometry, 2)
  }
}
