export const objectObject = '[object Object]'
export const objectArray = '[object Array]'

export const objectIsArray = (propertyObjects) => {
  return Object.prototype.toString.call(propertyObjects) === objectArray
}

export const objectIsObject = (propertyObjects) => {
  return Object.prototype.toString.call(propertyObjects) === objectObject
}
