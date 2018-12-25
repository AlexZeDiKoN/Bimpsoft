import { GRID_DATA, INIT_GRID_OPTIONS } from '../constants'
import {
  addLayerToCurrentGrid,
  removeLayerFromSelectedLayers,
} from '../helpers'

// додати листи до групи виділених
const addToSelected = (layer) => {
  layer.setStyle(INIT_GRID_OPTIONS)
  removeLayerFromSelectedLayers(layer)
  addLayerToCurrentGrid(layer)
}

// перевірка наявності листа в виділеній зоні
const listVerification = (zone, grid) => {
  grid.getLayers().forEach((layer) => {
    if (!zone.contains(layer.getCenter())) {
      addToSelected(layer)
    }
  })
}

const setSelectedZone = (layer) => {
  const bounds = layer.getBounds()
  // console.log(bounds)
  // console.log(GRID_DATA.selectedZone)
  if (GRID_DATA.selectedZone._northEast.lat >= bounds._northEast.lat) {
    GRID_DATA.selectedZone._northEast.lat = bounds._southWest.lat
  }
  if (GRID_DATA.selectedZone._northEast.lng >= bounds._northEast.lng) {
    GRID_DATA.selectedZone._northEast.lng = bounds._southWest.lng
  }
}

export const deselectLayer = (layer) => {
  setSelectedZone(layer)
  // console.log(GRID_DATA)
  listVerification(GRID_DATA.selectedZone, GRID_DATA.selectedLayers)
}
