import { ValidationError } from '../../constants/errors'
import i18n from '../../i18n'

export function validateMilsymbol (code = null, attributes = null) {
  if (!code) {
    throw new ValidationError(i18n.ERROR_EMPTY_MILSYMBOL_CODE)
  }
}
