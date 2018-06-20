import i18n from '../i18n'

export function ApiError (message) {
  this.name = i18n.SERVER_ERROR
  this.message = message || i18n.UNKNOWN_SERVER_ERROR
  this.stack = (new Error()).stack
}
