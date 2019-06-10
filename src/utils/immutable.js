import { List, Iterable } from 'immutable'

// Універсальні функції

export const update = (record, propName, updater, payload) => {
  const oldValue = record.get(propName)
  const newValue = typeof updater === 'function'
    ? updater(oldValue, payload)
    : updater
  return eq(newValue, oldValue)
    ? record
    : record.set(propName, newValue)
}

export const comparator = (oldValue, newValue) => eq(oldValue, newValue)
  ? oldValue
  : newValue

export const filter = (map, condition) => {
  const filtered = map
    .filter(condition)
  return map.equals(filtered)
    ? map
    : filtered
}

export const merge = (record, payload) =>
  Object.keys(payload).reduce((record, key) => {
    const oldValue = record.get(key)
    const newValue = payload[key]
    // console.log({ oldValue, newValue, eq: eq(oldValue, newValue) })
    return eq(oldValue, newValue)
      ? record
      : record.set(key, newValue)
  }, record)

// Специфічні функції

export const getArrayFromSet = (data, length) => length && data.size
  ? [ ...Array(length) ].map((_, i) => data.get(i) || String(i + 1))
  : data.toArray()

export const useArraysIn = (obj) => Object.keys(obj).reduce((acc, key) => {
  List.isList(obj[key]) && (acc[key] = obj[key].toArray())
  return acc
}, { ...obj })

// Допоміжні функції

/* eq */
const { isIterable, isOrdered, isKeyed, isIndexed, isAssociative } = Iterable
const isObject = (o) => typeof o === 'object' && o !== null

const objChecker = (a, b) => Object.keys(a).length === Object.keys(b).length
  ? Object.keys(a).every((key) => b.hasOwnProperty(key) ? eq(a[key], b[key]) : false)
  : false

const getBSize = (realA, realB, flipped) => {
  const a = flipped ? realB : realA
  const b = flipped ? realA : realB
  let allEqual = true
  const size = b.__iterate(function (v, k) {
    const notEqual = !isAssociative(a)
      ? !a.has(v)
      : flipped
        ? !eq(v, a.get(k, {}))
        : !eq(a.get(k, {}), v)
    if (notEqual) {
      allEqual = false
      return false // останавливаем подсчет
    }
  })
  return allEqual ? size : null
}

/** eq is patched immutable's method is */
const eq = (a, b) => {
  if (a === b) {
    return true
  }
  // вложенные структуры в коллекцию immutable могут быть не только представиетлями immutable
  if (isObject(a) && isObject(b)) {
    if (isIterable(a)) { // если а - представитель коллекции immutable
      if (
        !isIterable(b) || // если b - не представитель коллекции immutable
        (a.size !== undefined && b.size !== undefined && a.size !== b.size) ||
        (a.__hash !== undefined && b.__hash !== undefined && a.__hash !== b.__hash) ||
        isKeyed(a) !== isKeyed(b) ||
        isIndexed(a) !== isIndexed(b) ||
        isOrdered(a) !== isOrdered(b)
      ) {
        return false
      }

      if (a.size === 0 && b.size === 0) {
        return true
      }

      if (isOrdered(a)) {
        const entries = a.entries()
        return b.every(function (v, k) {
          const entry = entries.next().value
          return entry && eq(entry[1], v) && (!isAssociative(a) || eq(entry[0], k))
        }) && entries.next().done
      }

      if (a.size === undefined && b.size === undefined) {
        typeof a.cacheResult === 'function' && a.cacheResult()
      }

      const flipped = a.size === undefined && b.size !== undefined // меняем значения переданных аргументов
      const bSize = getBSize(a, b, flipped)
      return bSize !== null && a.size === bSize
    }
    return !isIterable(b) && objChecker(a, b)
  }
  return false
}
/* end eq */
