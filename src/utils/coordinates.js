import { CoordinatesTypes } from '../constants'
import i18n from '../i18n'

const parsers = new Map()

parsers.set(CoordinatesTypes.XY, (text) => {
  const [ x = null, y = null ] = text.split(' ')
  if (x === null || y === null) {
    return null
  }
  return { type: CoordinatesTypes.XY, x, y }
})

const parse = (text, type = null) => {
  if (text === '') {
    return null
  }
  let coordinate = null
  if (type !== null) {
    const parser = parsers.get(type)
    if (parser) {
      coordinate = parser(text)
    }
  } else {
    for (const parser of parsers.values()) {
      coordinate = parser(text)
      if (coordinate !== null) {
        break
      }
    }
  }
  return coordinate === null ? { type: CoordinatesTypes.WRONG, text } : coordinate
}

const formatters = {
  [CoordinatesTypes.XY]: ({ x, y }) => `${x} ${y}`,
  [CoordinatesTypes.WRONG]: ({ text }) => text,
}

const stringify = (coordinate = null) => {
  if (coordinate === null) {
    return ''
  }
  const { type } = coordinate
  const formatter = formatters[type]
  return formatter ? formatter(coordinate) : null
}

const isWrong = (coordinate) => Boolean(coordinate) && coordinate.type === CoordinatesTypes.WRONG

const names = {
  [CoordinatesTypes.WRONG]: i18n.ERROR,
}

const getName = (coordinate) => {
  if (!coordinate) {
    return ''
  }
  const { type } = coordinate
  return names.hasOwnProperty(type) ? names[type] : ''
}

export default {
  parse,
  stringify,
  isWrong,
  getName,
}
