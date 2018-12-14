import { CELL_SIZES, ITEM_NUMBER, ZOOM } from '../constants'

const listCoordinate = {}
const Z1M = {}
const Z100K = {}
const Z200K = {}
const Z500K = {}

// координата центра листа
const calculateListCoordinate = (coordinates) => {
  listCoordinate.lat = coordinates[0] - CELL_SIZES[ZOOM].lat / 2
  listCoordinate.lng = coordinates[1] + CELL_SIZES[ZOOM].lng / 2
}

// конвертер арабские -> римские
const convertToRoman = (num) => {
  const lookup = ITEM_NUMBER['200K']
  let roman = ''
  let i
  for (i in lookup) {
    while (num >= lookup[i]) {
      roman += i
      num -= lookup[i]
    }
  }
  return roman
}

// генерация номенклатурного номера для разных масштабов
const calculateNumberZ1M = () => {
  Z1M.y = Math.floor(Math.abs(listCoordinate.lat) / 4)
  Z1M.x = Math.ceil(Math.abs((listCoordinate.lng + 180) / 6))
  Z1M.itemNumber = `${ITEM_NUMBER['1M'][Z1M.y]} - ${Z1M.x}`
}

const calculateNumberZ500K = () => {
  Z500K.y = Math.ceil(((Z1M.y + 1) * 4 - listCoordinate.lat) / (CELL_SIZES[500000].lat))
  Z500K.x = Math.ceil((listCoordinate.lng - ((Z1M.x - 1) * 6 - 180)) / (CELL_SIZES[500000].lng))
  Z500K.itemNumber = `${ITEM_NUMBER['500K'][(Z500K.x + (Z500K.y - 1) * 2) - 1]}`
}

const calculateNumberZ200K = () => {
  Z200K.y = Math.ceil(((Z1M.y + 1) * 4 - listCoordinate.lat) / (CELL_SIZES[200000].lat))
  Z200K.x = Math.ceil((listCoordinate.lng - ((Z1M.x - 1) * 6 - 180)) / (CELL_SIZES[200000].lng))
  Z200K.itemNumber = convertToRoman(Z200K.x + (Z200K.y - 1) * 6)
}

const calculateNumberZ100K = () => {
  Z100K.y = Math.ceil(((Z1M.y + 1) * 4 - listCoordinate.lat) / (CELL_SIZES[100000].lat))
  Z100K.x = Math.ceil((listCoordinate.lng - ((Z1M.x - 1) * 6 - 180)) / (CELL_SIZES[100000].lng))
  Z100K.itemNumber = Z100K.x + (Z100K.y - 1) * 12
}

export const createItemNumber = (coordinates) => {
  let itemNumber
  calculateListCoordinate(coordinates)
  calculateNumberZ1M()
  switch (ZOOM) {
    case 500000:
      calculateNumberZ500K()
      itemNumber = `${Z1M.itemNumber} - ${Z500K.itemNumber}`
      break
    case 200000:
      calculateNumberZ200K()
      itemNumber = `${Z1M.itemNumber} - ${Z200K.itemNumber}`
      break
    case 100000:
      calculateNumberZ100K()
      itemNumber = `${Z1M.itemNumber} - ${Z100K.itemNumber}`
      break
    default:
      itemNumber = `${Z1M.itemNumber}`
  }
  return itemNumber
}
