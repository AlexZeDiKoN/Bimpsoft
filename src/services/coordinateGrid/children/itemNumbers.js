import { CELL_SIZES } from '../constants'

// конвертер арабские -> римские
const convertToRoman = (num) => {
  const lookup = { X: 10, IX: 9, V: 5, IV: 4, I: 1 }
  let roman = ''
  for (const i in lookup) {
    while (num >= lookup[i]) {
      roman += i
      num -= lookup[i]
    }
  }
  return roman
}

const config = {
  1000000: {
    'parts': [ 22, 60 ],
    'func': (x) => {
      const letter = String.fromCharCode('A'.charCodeAt(0) + 22 - Math.floor(x / 60) - 1)
      const number = Math.floor(x % 60) + 31
      // TODO: fix items after 60, 72 and 88 latitudes
      return `${letter}-${number}`
    },
    'step': [ 4, 6 ],
  },
}
config[500000] = {
  'parent': config[1000000],
  'parts': [ 2, 2 ],
  'func': (x) => String.fromCharCode('А'.charCodeAt(0) + Math.floor(x)),
  'step': [ 4 / 2, 6 / 2 ],
}
config[200000] = {
  'parent': config[1000000],
  'parts': [ 6, 6 ],
  'func': (x) => convertToRoman(Math.floor(x) + 1),
  'step': [ 4 / 6, 6 / 6 ],
}
config[100000] = {
  'parent': config[1000000],
  'parts': [ 12, 12 ],
  'func': (x) => Math.floor(x) + 1,
  'step': [ 4 / 12, 6 / 12 ],
}
config[50000] = {
  'parent': config[100000],
  'parts': [ 2, 2 ],
  'func': (x) => String.fromCharCode('А'.charCodeAt(0) + Math.floor(x)),
  'step': [ 4 / 12 / 2, 6 / 12 / 2 ],
}
config[25000] = {
  'parent': config[50000],
  'parts': [ 2, 2 ],
  'func': (x) => String.fromCharCode('а'.charCodeAt(0) + Math.floor(x)),
  'step': [ 4 / 12 / 2 / 2, 6 / 12 / 2 / 2 ],
}

const latlng2idx = (lat, lng, step, parts) =>
  (parts[0] - Math.floor(lat / step[0]) % parts[0] - 1) * parts[1] + Math.floor(lng / step[1]) % parts[1]

export const createItemNumber = (coordinates, scale) => {
  const [ lat, lng ] = [
    Math.abs(coordinates[0] - CELL_SIZES[scale].lat / 2),
    coordinates[1] + CELL_SIZES[scale].lng / 2,
  ]
  let c = config[scale]
  let itemNumber = ''
  while (c) {
    itemNumber = c['func'](latlng2idx(lat, lng, c['step'], c['parts'])) + '-' + itemNumber
    c = c['parent']
  }
  return itemNumber.slice(0, -1) + (coordinates[0] < 0 ? ' (П.П.)' : '')
}
