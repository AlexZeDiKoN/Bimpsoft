import { concat } from 'lodash'
import { layerGroup, rectangle } from 'leaflet'
import { INIT_GRID_OPTIONS, LAT, LNG } from '../constants'
import { isAreaOnScreen } from '../helpers'
import { selectLayer } from './selectLayer'

const createGridRectangle = (coordinates) => rectangle(coordinates, INIT_GRID_OPTIONS)

const isLayerExist = (coordinate, layers) =>
  layers.some((layer) => {
    const { _northEast: { lat, lng } } = layer.getBounds()
    const isLatExist = lat.toFixed(6) === coordinate[1][LAT].toFixed(6)
    const isLngExist = lng.toFixed(6) === coordinate[1][LNG].toFixed(6)
    return isLatExist && isLngExist
  })

export const createGridGroup = (coordinatesMatrix, selectedLayers) => {
  const rectangles = concat(...coordinatesMatrix)
    .map((coordinates) => createGridRectangle(coordinates))
  const currentGrid = layerGroup(rectangles)
  rectangles.map((rectangle) => rectangle.on('click', (e) => selectLayer(e, currentGrid, selectedLayers)))
  return currentGrid
}

export const updateGrid = (coordinatesList, scale, currentGrid, selectedLayers) => {
  // Видаляємо участки які виходять за межі екрану
  currentGrid.getLayers().forEach((layer) => {
    const { _northEast } = layer.getBounds()
    !isAreaOnScreen(_northEast, scale) && layer.removeFrom(currentGrid)
  })
  // Додаємо нові
  const layers = [ ...currentGrid.getLayers(), ...selectedLayers.getLayers() ]
  concat(...coordinatesList).forEach((coordinate) => {
    if (!isLayerExist(coordinate, layers)) {
      const newLayer = createGridRectangle(coordinate)
      newLayer.on('click', (e) => selectLayer(e, currentGrid, selectedLayers))
      currentGrid.addLayer(newLayer)
    }
  })
}
