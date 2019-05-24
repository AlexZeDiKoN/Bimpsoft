import * as R from 'ramda'

export const getProps = (props) => (state) => {
  const result = {}
  Object.entries(props).forEach(([ key, value ]) => (result[key] = value(state)))
  return result
}

export const isDataChanged = (currentObj, prevObj, fieldList) => Array.isArray(fieldList)
  ? fieldList.some((f) => Array.isArray(f)
    ? R.pathOr(undefined, f, currentObj) !== R.pathOr(undefined, f, prevObj)
    : currentObj[f] !== prevObj[f]
  )
  : currentObj[fieldList] !== prevObj[fieldList]
