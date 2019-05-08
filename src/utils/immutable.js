import { List, Iterable } from 'immutable'

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

// @TODO: eq is patched immutable's method is
const { isIterable, isOrdered, isKeyed, isIndexed, isAssociative } = Iterable
const isObject = (o) => typeof o === 'object' && o !== null

const objChecker = (a, b) => Object.keys(a).length === Object.keys(b).length
  ? Object.keys(a).every((key) => b.hasOwnProperty(key) ? eq(a[key], b[key]) : false)
  : false

const eq = (a, b) => {
  if (a === b) {
    return true
  }

  // вложенные структуры в коллекцию immutable
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

      const notAssociative = !isAssociative(a)

      if (isOrdered(a)) {
        const entries = a.entries()
        return b.every(function (v, k) {
          const entry = entries.next().value
          return entry && eq(entry[1], v) && (notAssociative || eq(entry[0], k))
        }) && entries.next().done
      }

      let flipped = false // переданные аргументы поменялись значениями

      if (a.size === undefined) {
        if (b.size === undefined) {
          typeof a.cacheResult === 'function' && a.cacheResult()
        } else {
          flipped = true
          const _ = a
          a = b
          b = _
        }
      }

      let allEqual = true
      const bSize = b.__iterate(function (v, k) {
        const notEqual = notAssociative
          ? !a.has(v)
          : flipped
            ? !eq(v, a.get(k, {}))
            : !eq(a.get(k, {}), v)
        if (notEqual) {
          allEqual = false
          return false // останавливаем подсчет
        }
      })

      return allEqual && a.size === bSize
    }
    return !isIterable(b) && objChecker(a, b)
  }
  return false
}
