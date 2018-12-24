import { concat } from 'lodash'
import { layerGroup, rectangle } from 'leaflet'
import { INIT_GRID_OPTIONS, LAT, LNG, SELECTED_CELL_OPTIONS, GRID_DATA } from '../constants'
import {
  isAreaOnScreen,
  removeLayerFromCurrentGrid,
  addLayerToSelectedLayers,
  removeLayerFromSelectedLayers,
  addLayerToCurrentGrid,
} from '../helpers'

const selectLayer = (layer) => {
  layer.setStyle(SELECTED_CELL_OPTIONS)
  removeLayerFromCurrentGrid(layer)
  addLayerToSelectedLayers(layer)
}

const deselectLayer = (layer) => {
  layer.setStyle(INIT_GRID_OPTIONS)
  removeLayerFromSelectedLayers(layer)
  addLayerToCurrentGrid(layer)
}

const addClickEvent = (layer) => {
  layer.on('click', (e) =>
    e.originalEvent.ctrlKey
      ? deselectLayer(e.target)
      : selectLayer(e.target)
  )
}

const createGridRectangle = (coordinates) => {
  const rectanglePolygon = rectangle(coordinates, INIT_GRID_OPTIONS)
  addClickEvent(rectanglePolygon)
  return rectanglePolygon
}

const isLayerExist = (coordinate, layers) =>
  layers.some((layer) => {
    const { _northEast: { lat, lng } } = layer.getBounds()
    const isLatExist = lat.toFixed(6) === coordinate[1][LAT].toFixed(6)
    const isLngExist = lng.toFixed(6) === coordinate[1][LNG].toFixed(6)
    return isLatExist && isLngExist
  })

export const createGridGroup = (coordinatesMatrix) => {
  const rectangles = concat(...coordinatesMatrix).map((coordinates) => createGridRectangle(coordinates))
  return layerGroup(rectangles)
}

export const updateGrid = (coordinatesList) => {
  const layerGroup = GRID_DATA.currentGrid
  // delete outside
  layerGroup.getLayers().forEach((layer) => {
    const { _northEast } = layer.getBounds()
    !isAreaOnScreen(_northEast) && layer.removeFrom(layerGroup)
  })
  // add new
  const layers = [ ...layerGroup.getLayers(), ...GRID_DATA.selectedLayers.getLayers() ]
  concat(...coordinatesList).forEach((coordinate) => {
    if (!isLayerExist(coordinate, layers)) {
      const newLayer = createGridRectangle(coordinate)
      layerGroup.addLayer(newLayer)
    }
  })
}
