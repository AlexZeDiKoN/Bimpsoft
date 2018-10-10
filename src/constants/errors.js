import i18n from '../i18n'

export function ApiError (message, name = i18n.SERVER_ERROR, isWarning = false) {
  this.name = name
  this.isWarning = isWarning
  this.message = message || i18n.UNKNOWN_SERVER_ERROR
  this.stack = (new Error()).stack
}
