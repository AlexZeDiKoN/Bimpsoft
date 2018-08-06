import { throttle, concat } from 'lodash'
import { rectangle, layerGroup } from 'leaflet'

import {
  CELL_SIZES_BY_Z,
  INIT_GRID_OPTIONS,
  SELECTED_CELL_OPTIONS,
  INITIAL_COORDINATES,
  GRID_CELLS_STRUCTURE,
  ZOOM,
  lat,
  lng,
} from './constants'

// temporary grid data
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

const isLayerExist = (coordinate, layers) =>
  layers.some((layer) => {
    const { _northEast: { lat, lng } } = layer.getBounds()
    const isLatExist = lat.toFixed(6) === coordinate[1][0].toFixed(6)
    const isLngExist = lng.toFixed(6) === coordinate[1][1].toFixed(6)
    return isLatExist && isLngExist
  })

const addNewLayers = (layerGroup, coordinatesList) => {
  const layers = layerGroup.getLayers()
  const filteredCoordinates = concat(...coordinatesList)
    .filter((coordinate) => !isLayerExist(coordinate, layers))
  for (const coordinate of filteredCoordinates) {
    const newLayer = createGridRectangle(coordinate)
    layerGroup.addLayer(newLayer)
  }
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

const throttledGridRecalculation = throttle(initGridRecalculation, 200)

const initCoordinateMapGrid = (map) => {
  createGride(map)
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
