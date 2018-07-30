import { debounce, concat } from 'lodash'
import { rectangle, layerGroup } from 'leaflet'

// GRID CONSTANTS
const CELL_SIZES_BY_Z = {
  1000000: {
    lat: 4,
    lng: 6,
  },
  500000: {
    lat: 2,
    lng: 3,
  },
  200000: {
    lat: 0.667,
    lng: 1,
  },
  100000: {
    lat: 0.332,
    lng: 0.5,
  },
  50000: {
    lat: 0.167,
    lng: 0.25,
  },
  25000: {
    lat: 0.083,
    lng: 0.125,
  },
  10000: {
    lat: 0.042,
    lng: 0.063,
  },
  5000: {
    lat: 0.021,
    lng: 0.031,
  },
  2000: {
    lat: 0.007,
    lng: 0.01,
  },
}
const INIT_GRID_OPTIONS = {
  color: 'black',
  fillOpacity: 0,
  weight: 1,
}
const SELECTED_CELL_OPTIONS = {
  color: 'blue',
  fillOpacity: 0.3,
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
const GRID_CELLS_STRUCTURE = {
  row_length: 0,
  column_length: 0,
}
const ZOOM = 50000
let currentGrid

// SETTING OUR GRID INITIAL DATA (mutations)
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
  GRID_CELLS_STRUCTURE.row_length = getRowLength(INITIAL_COORDINATES, CELL_SIZES_BY_Z, ZOOM)
  GRID_CELLS_STRUCTURE.column_length = getColumnLength(INITIAL_COORDINATES, CELL_SIZES_BY_Z, ZOOM)
}

// GRID calculation
const getCellBLC = (initTlc, cellNum, steps) => ([
  initTlc[lat] - steps.lat, initTlc[lng] + cellNum * steps.lng,
])
const getCellTRC = (initTlc, cellNum, steps) => ([
  initTlc[lat], initTlc[lng] + cellNum * steps.lng,
])

const getStartPoint = (initTLC, z) => {
  const initLat = (z.lat - Math.abs((initTLC[0] / z.lat) % 1 * z.lat)) + Math.abs(initTLC[0])
  const initLng = Math.abs(initTLC[1]) - Math.abs(((initTLC[1] / z.lng) % 1 * z.lng))
  const startLat = (initTLC[0] >= 0 ? 1 : -1) * initLat
  const startLng = (initTLC[1] >= 0 ? 1 : -1) * initLng
  return [ startLat, startLng ]
}

const createRow = (initTlc, z, amount) => {
  const row = []
  for (let i = 1; i <= amount + 1; i++) {
    row.push(
      [
        getCellBLC(initTlc, i - 1, z),
        getCellTRC(initTlc, i, z),
      ]
    )
  }
  return row
}

const generateGrid = (startTLC, z, GRID_CELLS_STRUCTURE) => {
  const grid = []
  const tlc = getStartPoint(startTLC, z)
  const rowsAmount = GRID_CELLS_STRUCTURE.column_length
  const cellsInRowAmount = GRID_CELLS_STRUCTURE.row_length
  for (let i = 0; i <= rowsAmount; i++) {
    tlc[0] = i ? tlc[0] - z.lat : tlc[0]
    grid.push(
      createRow(tlc, z, cellsInRowAmount)
    )
  }
  return grid
}

// event handlers and event helpers

const selectLayer = (layerId) => {
  currentGrid._layers[layerId].setStyle(SELECTED_CELL_OPTIONS)
}
const deselectLayer = (layerId) => {
  currentGrid._layers[layerId].setStyle(INIT_GRID_OPTIONS)
}

const addClickEvent = (layer) => {
  layer.on('click', (e) => {
    console.log(e)
    console.log(currentGrid)
    const layerId = e.target._leaflet_id
    e.originalEvent.ctrlKey
      ? deselectLayer(layerId)
      : selectLayer(layerId)
  })
}

// helpers

const createGridRectangle = (coordinates) => {
  const rectanglePoligon = rectangle(coordinates, INIT_GRID_OPTIONS)
  addClickEvent(rectanglePoligon)
  return rectanglePoligon
}

const createRectanglesGroup = (grid) => {
  const rectangles = concat(...grid).map((coordinates) => createGridRectangle(coordinates))
  return layerGroup(rectangles)
}

const isAreaOnScreen = (_northEast) => {
  const z = CELL_SIZES_BY_Z[ZOOM]
  const leftBorder = INITIAL_COORDINATES.TLC[lng]
  const topBorder = INITIAL_COORDINATES.TLC[lat] + z.lat
  const rightBorder = INITIAL_COORDINATES.BRC[lng] + z.lng
  const bottomBorder = INITIAL_COORDINATES.BRC[lat]

  return _northEast.lat >= bottomBorder &&
    _northEast.lat <= topBorder &&
    _northEast.lng >= leftBorder &&
  _northEast.lng <= rightBorder
}

const deleteOutsideLayers = (layerGroup) => {
  layerGroup
    .getLayers()
    .filter((layer) => {
      const { _northEast } = layer.getBounds()
      return !isAreaOnScreen(_northEast)
    })
    .forEach((layer) => layer.removeFrom(layerGroup))
}

const isLayerExist = (layer, northEast, layers) => {

}

const addNewLayers = (layerGroup, coordinatesList) => {
  console.log(layerGroup)
  console.log(layerGroup
    .getLayers()
    .forEach((layer, index, layers) => {
      const { _northEast } = layer.getBounds()
      console.log(_northEast)
    }))
  console.log(coordinatesList)
}
// initial method
const createGride = (map) => {
  setInitCoordinates(map.getBounds())
  setGridCellsAmount()
  const coordinatesMatrix = generateGrid(INITIAL_COORDINATES.TLC, CELL_SIZES_BY_Z[ZOOM], GRID_CELLS_STRUCTURE)
  if (!currentGrid) {
    const Grid = createRectanglesGroup(coordinatesMatrix)
    Grid.addTo(map)
    currentGrid = Grid
    return
  }
  deleteOutsideLayers(currentGrid)
  addNewLayers(currentGrid, coordinatesMatrix)
}

const initGridRecalculation = (e) => {
  const map = e.target
  createGride(map)
}

const deboucedGridRecalculation = debounce(initGridRecalculation, 500)

const initCoordinateMapGrid = (map) => {
  createGride(map)
  map.on('move', deboucedGridRecalculation)
}

const removeCoordinateMapGrid = (map) => {
  map.off('move', deboucedGridRecalculation)
  currentGrid.removeFrom(map)
}

export const toggleMapGrid = (map, isActive) => isActive
  ? initCoordinateMapGrid(map)
  : removeCoordinateMapGrid(map)
