import { throttle } from 'lodash'
import { layerGroup } from 'leaflet'
import { generateCoordinateMatrix } from './children/coordinateMatrix'
import { createGridGroup, updateGrid } from './children/grid'
import { createMarkersGroup, updateMarkers } from './children/markers'
import { removeLayerFromSelectedLayers } from './helpers'
import './coordinateGrid.css'

import { GRID_DATA } from './constants'

GRID_DATA.selectedLayers = layerGroup()

// main Grid function
const createGrid = (map) => {
  const coordinatesMatrix = generateCoordinateMatrix(map)
  if (!GRID_DATA.currentGrid) {
    const Grid = createGridGroup(coordinatesMatrix)
    const Markers = createMarkersGroup(coordinatesMatrix)
    Grid.addTo(map)
    Markers.addTo(map)
    GRID_DATA.selectedLayers.addTo(map)
    GRID_DATA.currentGrid = Grid
    GRID_DATA.currentMarkers = Markers
    return
  }
  updateGrid(coordinatesMatrix)
  updateMarkers(coordinatesMatrix)
}

// initial methods
const initGridRecalculation = (e) => {
  const map = e.target
  createGrid(map)
}

const throttledGridRecalculation = throttle(initGridRecalculation, 200)

const initCoordinateMapGrid = (map, scale) => {
  setScale(map, scale)
  createGrid(map)
  map.on('move', throttledGridRecalculation)
}

const setScale = (map, scale) => {
  if (GRID_DATA.scale !== undefined && GRID_DATA.scale !== scale) {
    removeCoordinateMapGrid(map)
  }
  GRID_DATA.scale = scale
}

const removeCoordinateMapGrid = (map) => {
  map.off('move', throttledGridRecalculation)
  GRID_DATA.currentGrid.removeFrom(map)
  GRID_DATA.selectedLayers.removeFrom(map)
  GRID_DATA.currentMarkers.removeFrom(map)
  GRID_DATA.currentGrid = GRID_DATA.currentMarkers = GRID_DATA.selectedZone = null
  GRID_DATA.selectedLayers.eachLayer(removeLayerFromSelectedLayers)
}

export const toggleMapGrid = (map, isActive, scale) => isActive
  ? initCoordinateMapGrid(map, scale)
  : removeCoordinateMapGrid(map)
