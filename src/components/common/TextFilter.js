const specials = '-[]/{}()*+?.\\^$|'
const regexSpecials = RegExp('[' + specials.split('').join('\\') + ']', 'g')

function getRegExp (str) {
  return new RegExp(`(${str})`, 'gi')
}

export default class TextFilter {
  constructor (filters) {
    filters = filters.map((str) => str.replace(regexSpecials, '\\$&'))
    this.regExpParts = getRegExp(filters.join('|'))
    this.regExpTest = getRegExp(filters.join('(.+?)'))
  }

  parts (text) {
    return text.split(this.regExpParts).map((part, i) => ({
      text: part,
      selected: Boolean(i % 2),
    }))
  }

  test (text) {
    return this.regExpTest.test(text)
  }

  static create (text) {
    if (text === null || text.length === 0) {
      return null
    }
    const texts = text.split(/[ ]+/).filter((str) => str.length !== 0)
    if (texts.length === 0) {
      return null
    }
    return new TextFilter(texts)
  }

  static getFilteredIdsFunc = (textKey, idKey, parentIdKey) => (textFilter, byIds) => {
    if (!(textFilter instanceof TextFilter)) {
      return null
    }
    const filteredIds = {}
    const items = Object.values(byIds)
    for (let itemData of items) {
      if (textFilter.test(itemData[textKey])) {
        do {
          filteredIds[itemData[idKey]] = true
          itemData = byIds[itemData[parentIdKey]]
        } while (itemData && !filteredIds.hasOwnProperty(itemData[idKey]))
      }
    }
    return filteredIds
  }
}
