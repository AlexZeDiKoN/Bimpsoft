import { CELL_SIZES, GRID_CELLS_STRUCTURE, LAT, LNG, SCREEN_COORDINATES, GRID_DATA } from '../constants'
import { setInitCoordinates } from './../helpers'

const getRowLength = (initCoordinate, cellSizes, Z) => {
  const distance = Math.abs(initCoordinate.TLC[LNG] - initCoordinate.TRC[LNG])
  return Math.ceil(distance / cellSizes[Z].lng)
}

const getColumnLength = (initCoordinate, cellSizes, Z) => {
  const distance = Math.abs(initCoordinate.TLC[LAT] - initCoordinate.BLC[LAT])
  return Math.ceil(distance / cellSizes[Z].lat)
}

const setGridCellsAmount = () => {
  GRID_CELLS_STRUCTURE.row_length = getRowLength(SCREEN_COORDINATES, CELL_SIZES, GRID_DATA.scale)
  GRID_CELLS_STRUCTURE.column_length = getColumnLength(SCREEN_COORDINATES, CELL_SIZES, GRID_DATA.scale)
}

const getCellBLC = (initTlc, cellNum, steps) => ([
  initTlc[LAT] - steps.lat, initTlc[LNG] + cellNum * steps.lng,
])
const getCellTRC = (initTlc, cellNum, steps) => ([
  initTlc[LAT], initTlc[LNG] + cellNum * steps.lng,
])

const getStartPoint = (initTLC, Z) => {
  const initLat = (Z.lat - Math.abs((initTLC[LAT] / Z.lat) % 1 * Z.lat)) + Math.abs(initTLC[LAT])
  const initLng = Math.abs(initTLC[LNG]) - Math.abs(((initTLC[LNG] / Z.lng) % 1 * Z.lng))
  const startLat = (initTLC[LAT] >= 0 ? 1 : -1) * initLat
  const startLng = (initTLC[LNG] >= 0 ? 1 : -1) * initLng
  return [ startLat, startLng ]
}

const createRow = (initTlc, Z, amount) => {
  const row = []
  for (let i = 1; i <= amount + 1; i++) {
    row.push(
      [
        getCellBLC(initTlc, i - 1, Z),
        getCellTRC(initTlc, i, Z),
      ]
    )
  }
  return row
}

const generateGrid = (startTLC, Z, GRID_CELLS_STRUCTURE) => {
  const grid = []
  const tlc = getStartPoint(startTLC, Z)
  const rowsAmount = GRID_CELLS_STRUCTURE.column_length
  const cellsInRowAmount = GRID_CELLS_STRUCTURE.row_length
  for (let i = 0; i <= rowsAmount; i++) {
    tlc[LAT] = i ? tlc[LAT] - Z.lat : tlc[LAT]
    grid.push(
      createRow(tlc, Z, cellsInRowAmount)
    )
  }
  return grid
}

export const generateCoordinateMatrix = (map) => {
  setInitCoordinates(map.getBounds())
  setGridCellsAmount()
  return generateGrid(SCREEN_COORDINATES.TLC, CELL_SIZES[GRID_DATA.scale], GRID_CELLS_STRUCTURE)
}
