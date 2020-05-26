import i18n from '../../i18n'
import { ValidationError } from '../../constants/errors'

export function validateText (text, numberBox) {
  if (!text || !text.text || !text.text.length) {
    throw new ValidationError(i18n.ERROR_TEXT_ISSET, `${i18n.VALIDATION_ERROR} ${numberBox} ${i18n.ERROR_TEXT_NULL} `)
  }
}

export function validateTexts (texts) {
  if (!texts || !texts.length) {
    throw new ValidationError(i18n.ERROR_TEXTS_NULL)
  }
  let ind = 0
  for (const text of texts) {
    ind++
    validateText(text, ind)
  }
}
