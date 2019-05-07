import { List, Iterable } from 'immutable'
const eq = (oldValue, newValue) =>
  newValue === oldValue ||
  (isIterable(newValue) && isIterable(oldValue) && is(oldValue, newValue))

export const update = (record, propName, updater, payload) => {
  const oldValue = record.get(propName)
  const newValue = typeof updater === 'function' ? updater(oldValue, payload) : updater
  return eq(newValue, oldValue) ? record : record.set(propName, newValue)
}

export const comparator = (oldValue, newValue) => eq(oldValue, newValue) ? oldValue : newValue

export const filter = (map, condition) => {
  const filtered = map.filter(condition)
  return map.equals(filtered) ? map : filtered
}

export const merge = (record, payload) =>
  Object.keys(payload).reduce((record, key) => {
    const oldValue = record.get(key)
    const newValue = payload[key]
    return eq(oldValue, newValue) ? record : record.set(key, newValue)
  }, record)

export const getArrayFromSet = (data, length) => length && data.size
  ? [ ...Array(length) ].map((_, i) => data.get(i) || ++i)
  : data.toArray()

export const useArraysIn = (obj) => Object.keys(obj).reduce((acc, key) => {
  List.isList(obj[key]) && (acc[key] = obj[key].toArray())
  return acc
}, { ...obj })

// @TODO: Patching of immutable's method is
const { isIterable, isOrdered, isAssociative } = Iterable
const is = (a, b) => {
  // вложенные структуры в коллекцию immutable
  if (isObject(a) && isObject(b) && !isIterable(a) && !isIterable(b)) {
    return objChecker(a, b)
  }

  if (a.size === 0 && b.size === 0) {
    return true
  }

  const notAssociative = !isAssociative(a)

  if (isOrdered(a)) {
    const entries = a.entries()
    return b.every(function (v, k) {
      const entry = entries.next().value
      return entry && is(entry[1], v) && (notAssociative || is(entry[0], k))
    }) && entries.next().done
  }

  let flipped = false

  if (a.size === undefined) {
    if (b.size === undefined) {
      if (typeof a.cacheResult === 'function') {
        a.cacheResult()
      }
    } else {
      flipped = true
      const _ = a
      a = b
      b = _
    }
  }

  let allEqual = true
  const bSize = b.__iterate(function (v, k) {
    if (notAssociative ? !a.has(v)
      : flipped ? !is(v, a.get(k, {})) : !is(a.get(k, {}), v)) {
      allEqual = false
      return false
    }
  })

  return allEqual && a.size === bSize
}

const isObject = (o) => typeof o === 'object' && o !== null
const objChecker = (a, b) => {
  if (Object.keys(a).length === Object.keys(b).length) {
    return Object.keys(a).every((key) => {
      if (b.hasOwnProperty(key)) {
        if (a[key] === b[key]) {
          return true
        }
        if (isObject(a[key]) && isObject(b[key])) {
          return isIterable(a[key]) ? is(a[key], b[key]) : objChecker(a[key], b[key])
        }
      }
      return false
    })
  }
  return false
}
