import i18n from '../i18n'

export class ApiError extends Error {
  constructor (message, name = i18n.SERVER_ERROR, isWarning = false) {
    super()
    this.name = name
    this.isWarning = isWarning
    this.message = message || i18n.UNKNOWN_SERVER_ERROR
  }
}

export class ValidationError extends ApiError {
  constructor (message, name = i18n.VALIDATION_ERROR, isWarning = false) {
    super(message, name, isWarning)
  }
}
