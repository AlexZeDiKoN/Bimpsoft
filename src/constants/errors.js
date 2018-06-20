export function ApiError (message) {
  this.name = 'Помилка сервера'
  this.message = message || 'Невідома помилка сервера'
  this.stack = (new Error()).stack
}
