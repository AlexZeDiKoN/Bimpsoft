const eq = (oldValue, newValue) => newValue === oldValue || (newValue && newValue.equals && newValue.equals(oldValue))

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
    return oldValue === newValue ? record : record.set(key, newValue)
  }, record)

export const getArrayFromSet = (data, length) => length && data.size
  ? [ ...Array(length) ].map((_, i) => data.get(i) || ++i)
  : data.toArray()
