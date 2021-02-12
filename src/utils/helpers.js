export class Deferred {
  constructor () {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject
      this.resolve = resolve
    })
  }
}

export const objectHas = (object, key) => Object.prototype.hasOwnProperty.call(object, key)
