import { CoordinatesTypes } from '../constants'
import i18n from '../i18n'

const parsers = new Map()

const wgsRegExp = /^\s*([+-]?([0-9]*[.])?[0-9]+)\s+([+-]?([0-9]*[.])?[0-9]+)\s*$/

parsers.set(CoordinatesTypes.WGS, (text) => {
  const m = text.match(wgsRegExp)
  if (m === null) {
    return null
  }
  return { lat: m[1], lng: m[3], type: CoordinatesTypes.WGS_84, text }
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
  return coordinate === null ? { text } : coordinate
}

const formatters = {
  [CoordinatesTypes.WGS_84]: ({ lat = 0, lng = 0 }) => `${lat.toFixed(7)} ${lng.toFixed(7)}`,
}

const stringify = (coordinate = null, defType = CoordinatesTypes.WGS_84) => {
  if (coordinate === null) {
    return ''
  }
  const { type = defType, text = null } = coordinate
  if (text !== null) {
    return text
  }
  const formatter = formatters[type]
  return formatter ? formatter(coordinate) : null
}

const isWrong = (coordinate) => Boolean(coordinate) && (!coordinate.lat || !coordinate.lng)

const names = {
  [CoordinatesTypes.WGS_84]: i18n.WGS_84,
}

const getName = (coordinate) => {
  if (!coordinate) {
    return ''
  }
  const { type = CoordinatesTypes.WGS_84 } = coordinate
  return names.hasOwnProperty(type) ? names[type] : ''
}

export default {
  parse,
  stringify,
  isWrong,
  getName,
}
