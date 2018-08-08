import { throttle, concat } from 'lodash'
import { rectangle, layerGroup } from 'leaflet'

import {
  CELL_SIZES,
  INIT_GRID_OPTIONS,
  SELECTED_CELL_OPTIONS,
  SCREEN_COORDINATES,
  GRID_CELLS_STRUCTURE,
  ZOOM,
  LAT,
  LNG,
} from './constants'

// temporary grid data
let currentGrid
// let selectedLayers

// SETTING OUR GRID INITIAL DATA (mutations our constants)
const getRowLength = (initCoordinate, cellSizes, Z) => {
  const distance = Math.abs(initCoordinate.TLC[LNG] - initCoordinate.TRC[LNG])
  return Math.ceil(distance / cellSizes[Z].lng)
}

const getColumnLength = (initCoordinate, cellSizes, Z) => {
  const distance = Math.abs(initCoordinate.TLC[LAT] - initCoordinate.BLC[LAT])
  return Math.ceil(distance / cellSizes[Z].lat)
}

const setGridCellsAmount = () => {
  GRID_CELLS_STRUCTURE.row_length = getRowLength(SCREEN_COORDINATES, CELL_SIZES, ZOOM)
  GRID_CELLS_STRUCTURE.column_length = getColumnLength(SCREEN_COORDINATES, CELL_SIZES, ZOOM)
}

const setInitCoordinates = (screenBounds) => {
  const { _northEast, _southWest } = screenBounds

  SCREEN_COORDINATES.TLC = [ _northEast.lat, _southWest.lng ]
  SCREEN_COORDINATES.TRC = [ _northEast.lat, _northEast.lng ]
  SCREEN_COORDINATES.BLC = [ _southWest.lat, _southWest.lng ]
  SCREEN_COORDINATES.BRC = [ _southWest.lat, _northEast.lng ]
}

// GRID calculation
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

// event handlers and event helpers

const selectLayer = (layer) => layer.setStyle(SELECTED_CELL_OPTIONS)

const deselectLayer = (layer) => layer.setStyle(INIT_GRID_OPTIONS)

const addClickEvent = (layer) => {
  layer.on('click', (e) =>
    e.originalEvent.ctrlKey
      ? deselectLayer(e.target)
      : selectLayer(e.target)
  )
}

// helpers
const createGridRectangle = (coordinates) => {
  const rectanglePolygon = rectangle(coordinates, INIT_GRID_OPTIONS)
  addClickEvent(rectanglePolygon)
  return rectanglePolygon
}

const createRectanglesGroup = (grid) => {
  const rectangles = concat(...grid).map((coordinates) => createGridRectangle(coordinates))
  return layerGroup(rectangles)
}

// calculation per move event
const isAreaOnScreen = (_northEast) => {
  const Z = CELL_SIZES[ZOOM]
  const leftBorder = SCREEN_COORDINATES.TLC[LNG]
  const topBorder = SCREEN_COORDINATES.TLC[LAT] + Z.lat
  const rightBorder = SCREEN_COORDINATES.BRC[LNG] + Z.lng
  const bottomBorder = SCREEN_COORDINATES.BRC[LAT]

  return _northEast.lat >= bottomBorder &&
    _northEast.lat <= topBorder &&
    _northEast.lng >= leftBorder &&
    _northEast.lng <= rightBorder
}

const deleteOutsideLayers = (layerGroup) => {
  layerGroup
    .getLayers()
    .forEach((layer) => {
      const { _northEast } = layer.getBounds()
      !isAreaOnScreen(_northEast) &&
        layer.removeFrom(layerGroup)
    })
}

const isLayerExist = (coordinate, layers) =>
  layers.some((layer) => {
    const { _northEast: { lat, lng } } = layer.getBounds()
    const isLatExist = lat.toFixed(6) === coordinate[1][LAT].toFixed(6)
    const isLngExist = lng.toFixed(6) === coordinate[1][LNG].toFixed(6)
    return isLatExist && isLngExist
  })

const addNewLayers = (layerGroup, coordinatesList) => {
  const layers = layerGroup.getLayers()
  concat(...coordinatesList)
    .forEach((coordinate) => {
      if (!isLayerExist(coordinate, layers)) {
        const newLayer = createGridRectangle(coordinate)
        layerGroup.addLayer(newLayer)
      }
    })
}

// main Grid function
const createGrid = (map) => {
  setInitCoordinates(map.getBounds())
  setGridCellsAmount()
  const coordinatesMatrix = generateGrid(SCREEN_COORDINATES.TLC, CELL_SIZES[ZOOM], GRID_CELLS_STRUCTURE)
  if (!currentGrid) {
    const Grid = createRectanglesGroup(coordinatesMatrix)
    Grid.addTo(map)
    currentGrid = Grid
    return
  }
  deleteOutsideLayers(currentGrid)
  addNewLayers(currentGrid, coordinatesMatrix)
}

// initial methods
const initGridRecalculation = (e) => {
  const map = e.target
  createGrid(map)
}

const throttledGridRecalculation = throttle(initGridRecalculation, 200)

const initCoordinateMapGrid = (map) => {
  createGrid(map)
  map.on('move', throttledGridRecalculation)
}

const removeCoordinateMapGrid = (map) => {
  map.off('move', throttledGridRecalculation)
  currentGrid.removeFrom(map)
  currentGrid = null
}

export const toggleMapGrid = (map, isActive) => isActive
  ? initCoordinateMapGrid(map)
  : removeCoordinateMapGrid(map)
