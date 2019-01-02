import i18n from '../../i18n'
import { ValidationError } from '../../constants/errors'

export function validateText (text) {
  if (!text || !text.text || !text.text.length) {
    throw new ValidationError(i18n.EMPTY_TEXT)
  }
}

export function validateTexts (texts) {
  if (!texts || !texts.length) {
    throw new ValidationError(i18n.EMPTY_TEXT)
  }
  for (const text of texts) {
    validateText(text)
  }
}
