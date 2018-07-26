import { throttle, concat } from 'lodash'
import { rectangle, layerGroup } from 'leaflet'

// GRID CONSTANTS
const CELL_SIZES_BY_Z = {
  1: {
    lng: 4,
    lat: 6,
  },
  2: {
    lng: 4,
    lat: 6,
  },
  3: {
    lng: 4,
    lat: 6,
  },
  4: {
    lng: 4,
    lat: 6,
  },
  5: {
    lng: 4,
    lat: 6,
  },
  6: {
    lng: 4,
    lat: 6,
  },
  7: {
    lng: 4,
    lat: 6,
  },
  8: {
    lng: 4,
    lat: 6,
  },
  9: {
    lng: 4,
    lat: 6,
  },
  10: {
    lng: 4,
    lat: 6,
  },
  11: {
    lng: 2,
    lat: 3,
  },
  12: {
    lng: 0.667,
    lat: 1,
  },
  13: {
    lng: 0.332,
    lat: 0.5,
  },
  14: {
    lng: 0.167,
    lat: 0.25,
  },
  15: {
    lng: 0.167,
    lat: 0.25,
  },
  16: {
    lng: 0.083,
    lat: 0.125,
  },
  17: {
    lng: 0.042,
    lat: 0.063,
  },
  18: {
    lng: 0.021,
    lat: 0.031,
  },
  19: {
    lng: 0.007,
    lat: 0.01,
  },
  20: {
    lng: 0.007,
    lat: 0.01,
  },
}
const lat = 0
const lng = 1
// GRID INITIAL DATA
const INITIAL_COORDINATES = {
  TLC: [ 0, 0 ],
  TRC: [ 0, 0 ],
  BLC: [ 0, 0 ],
  BRC: [ 0, 0 ],
}
const GRID_CELLS_AMOUNT = {
  row_length: 0,
  column_length: 0,
}
let ZOOM = 10

// SETTING OUR GRID INITIAL DATA
const setInitCoordinates = (screenBounds) => {
  const { _northEast, _southWest } = screenBounds

  INITIAL_COORDINATES.TLC = [ _northEast.lat, _southWest.lng ]
  INITIAL_COORDINATES.TRC = [ _northEast.lat, _northEast.lng ]
  INITIAL_COORDINATES.BLC = [ _southWest.lat, _southWest.lng ]
  INITIAL_COORDINATES.BRC = [ _southWest.lat, _northEast.lng ]
}

const getRowLength = (initCoordinate, cellSizes, Z) => {
  const distance = Math.abs(initCoordinate.TLC[lng] - initCoordinate.TRC[lng])
  return Math.ceil(distance / cellSizes[Z].lng)
}

const getColumnLength = (initCoordinate, cellSizes, Z) => {
  const distance = Math.abs(initCoordinate.TLC[lat] - initCoordinate.BLC[lat])
  return Math.ceil(distance / cellSizes[Z].lat)
}

const setGridCellsAmount = () => {
  GRID_CELLS_AMOUNT.row_length = getRowLength(INITIAL_COORDINATES, CELL_SIZES_BY_Z, ZOOM)
  GRID_CELLS_AMOUNT.column_length = getColumnLength(INITIAL_COORDINATES, CELL_SIZES_BY_Z, ZOOM)
}

// dfsdfsd
const getCellBLC = (initTlc, cellNum, lngDiff, lat) => ([
  lat, initTlc[lng] - (cellNum - 1) * lngDiff,
])
const getCellTRC = (initTlc, cellNum, lngDiff, lat) => ([
  lat, initTlc[lng] - (cellNum * lngDiff),
])

const createRow = (initTlc, z, amount) => {
  const row = []
  const y = initTlc[lat] + z.lat
  for (let i = 2; i <= amount + 1; i++) {
    row.push(
      [
        getCellBLC(initTlc, i, z.lng, y),
        getCellTRC(initTlc, i, z.lng, initTlc[lat]),
      ]
    )
  }
  return row
}

const generateGrid = (initTLC, z, GRID_CELLS_AMOUNT) => {
  const grid = []
  const tlc = [ ...initTLC ]
  const columsAmount = GRID_CELLS_AMOUNT.column_length
  const rowsAmount = GRID_CELLS_AMOUNT.row_length
  for (let i = 1; i <= columsAmount; i++) {
    tlc[0] = tlc[0] - z.lat
    grid.push(
      createRow(tlc, z, rowsAmount)
    )
  }
  return grid
}

const initGridRecalculation = (map) => {
  setInitCoordinates(map.getBounds())
  setGridCellsAmount()
  console.log(map)
  console.log(INITIAL_COORDINATES)
  console.log(GRID_CELLS_AMOUNT)
  console.log(ZOOM)
  const grid = generateGrid(INITIAL_COORDINATES.TLC, CELL_SIZES_BY_Z[ZOOM], GRID_CELLS_AMOUNT)
  console.log(grid)
  const rectangles = concat(...grid).map((item) => rectangle(item))
  layerGroup(rectangles)
    .addTo(map)
}

const gridRecalculation = (map) => () => initGridRecalculation(map)

export default function initGrid (mymap) {
  mymap.on('move', throttle(() => initGridRecalculation(mymap), 1000))
}
