import { CELL_SIZES, GRID_DATA, ITEM_NUMBER } from '../constants'

const listCoordinate = {}
const Z1M = {}
const Z1MDerivative = {}

// координата центра листа
const calculateListCoordinate = (coordinates) => {
  listCoordinate.lat = coordinates[0] - CELL_SIZES[GRID_DATA.scale].lat / 2
  listCoordinate.lng = coordinates[1] + CELL_SIZES[GRID_DATA.scale].lng / 2
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

const listPosition = (cellSize) => {
  Z1MDerivative.y = Math.ceil(((Z1M.y + 1) * 4 - listCoordinate.lat) / cellSize.lat)
  Z1MDerivative.x = Math.ceil((listCoordinate.lng - ((Z1M.x - 1) * 6 - 180)) / cellSize.lng)
}
// генерация номенклатурного номера
const calculateNumberZ1M = () => {
  Z1M.y = Math.floor(Math.abs(listCoordinate.lat) / 4)
  Z1M.x = Math.ceil(Math.abs((listCoordinate.lng + 180) / 6))
  Z1M.itemNumber = `${ITEM_NUMBER['1M'][Z1M.y]} - ${Z1M.x}`
}

export const createItemNumber = (coordinates) => {
  let itemNumber
  calculateListCoordinate(coordinates)
  calculateNumberZ1M()
  listPosition(CELL_SIZES[GRID_DATA.scale])
  switch (GRID_DATA.scale) {
    case 500000:
      Z1MDerivative.itemNumber = `${ITEM_NUMBER['500K'][(Z1MDerivative.x + (Z1MDerivative.y - 1) * 2) - 1]}`
      itemNumber = `${Z1M.itemNumber} - ${Z1MDerivative.itemNumber}`
      break
    case 200000:
      Z1MDerivative.itemNumber = convertToRoman(Z1MDerivative.x + (Z1MDerivative.y - 1) * 6)
      itemNumber = `${Z1M.itemNumber} - ${Z1MDerivative.itemNumber}`
      break
    case 100000:
      Z1MDerivative.itemNumber = Z1MDerivative.x + (Z1MDerivative.y - 1) * 12
      itemNumber = `${Z1M.itemNumber} - ${Z1MDerivative.itemNumber}`
      break
    default:
      itemNumber = `${Z1M.itemNumber}`
  }
  return itemNumber
}
