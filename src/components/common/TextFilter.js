const specials = '-[]/{}()*+?.\\^$|'
const regexSpecials = RegExp('[' + specials.split('').join('\\') + ']', 'g')

export default class TextFilter {
  constructor (filters) {
    filters = filters.map((str) => str.replace(regexSpecials, '\\$&'))
    this.regExpParts = new RegExp(`(${filters.join('|')})`, 'gi')
    this.regExpTest = new RegExp(filters.join('(.+?)'), 'i')
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

  static getFilteredIdsFunc = (valueSelector, idSelector, parentIdSelector) => (textFilter, byIds) => {
    if (!(textFilter instanceof TextFilter)) {
      return null
    }
    const filteredIds = {}
    const items = Object.values(byIds)
    for (let itemData of items) {
      if (textFilter.test(valueSelector(itemData))) {
        do {
          filteredIds[idSelector(itemData)] = true
          itemData = byIds[parentIdSelector(itemData)]
        } while (itemData && !filteredIds.hasOwnProperty(idSelector(itemData)))
      }
    }
    return filteredIds
  }
}
