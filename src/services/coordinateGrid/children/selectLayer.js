import { GRID_DATA, SELECTED_CELL_OPTIONS } from '../constants'
import { addLayerToSelectedLayers, removeLayerFromCurrentGrid } from '../helpers'

export const selectLayer = (layer) => {
  setSelectedZone(layer)
  listVerification(GRID_DATA.selectedZone, GRID_DATA.currentGrid)
}

// створення і редагування зони покриття
const setSelectedZone = (layer) => {
  const bounds = layer.getBounds()
  if (GRID_DATA.selectedZone) {
    if (GRID_DATA.selectedZone._northEast.lat < bounds._northEast.lat) {
      GRID_DATA.selectedZone._northEast.lat = bounds._northEast.lat
    }
    if (GRID_DATA.selectedZone._northEast.lng < bounds._northEast.lng) {
      GRID_DATA.selectedZone._northEast.lng = bounds._northEast.lng
    }
    if (GRID_DATA.selectedZone._southWest.lat > bounds._southWest.lat) {
      GRID_DATA.selectedZone._southWest.lat = bounds._southWest.lat
    }
    if (GRID_DATA.selectedZone._southWest.lng > bounds._southWest.lng) {
      GRID_DATA.selectedZone._southWest.lng = bounds._southWest.lng
    }
  } else {
    GRID_DATA.selectedZone = bounds
  }
}

// перевірка наявності листа в виділеній зоні
const listVerification = (zone, grid) => {
  grid.getLayers().forEach((layer) => {
    if (zone.contains(layer.getCenter())) {
      addToSelected(layer)
    }
  })
}

// додати листи до групи виділених
const addToSelected = (layer) => {
  layer.setStyle(SELECTED_CELL_OPTIONS)
  removeLayerFromCurrentGrid(layer)
  addLayerToSelectedLayers(layer)
}
