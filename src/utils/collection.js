export const getPathFunc = (valueSelector, idSelector, parentIdSelector) => (byIds, id) => {
  const path = []
  if (byIds.hasOwnProperty(id)) {
    let value = byIds[id]
    path.push(valueSelector(value))

    while (parentIdSelector(value)) {
      value = byIds[parentIdSelector(value)]
      path.unshift(valueSelector(value))
    }
  }
  return path
}
