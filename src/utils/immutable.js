export const update = (record, propName, updater, payload) => {
  const oldValue = record.get(propName)
  const newValue = updater(oldValue, payload)
  return newValue.equals(oldValue) ? record : record.set(propName, newValue)
}

export const comparator = (oldValue, newValue) =>
  newValue === oldValue || newValue.equals(oldValue) ? oldValue : newValue

export const filter = (map, condition) => {
  const filtered = map.filter(condition)
  return map.equals(filtered) ? map : filtered
}
