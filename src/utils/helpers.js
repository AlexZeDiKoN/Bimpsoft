import { getStringName } from './selectors'

export class Deferred {
  constructor () {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject
      this.resolve = resolve
    })
  }
}

export const objectHas = (object, key) => Object.prototype.hasOwnProperty.call(object, key)

export const sortByAlphabet = (byIds, selector = getStringName) => (aValue, bValue) => {
  const a = selector(byIds?.[aValue] ?? aValue)
  const b = selector(byIds?.[bValue] ?? bValue)
  return a.localeCompare(b)
}

export const sortByIds = (byIds = {}, itemSelector = getStringName, sortFn = sortByAlphabet) => {
  const sort = sortFn(byIds, itemSelector)
  for (const unit of Object.values(byIds)) {
    if (unit && unit.children && unit.children.length) {
      unit.children = unit.children.sort(sort)
    }
  }
}

export const sortRoots = (roots = [], byIds, itemSelector = getStringName, sortFn = sortByAlphabet) =>
  roots.sort(sortFn(byIds, itemSelector))
