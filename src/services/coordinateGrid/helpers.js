import { CELL_SIZES, GRID_DATA, LAT, LNG, SCREEN_COORDINATES } from './constants'

export const isAreaOnScreen = (_northEast) => {
  const Z = CELL_SIZES[GRID_DATA.scale]
  const leftBorder = SCREEN_COORDINATES.TLC[LNG]
  const topBorder = SCREEN_COORDINATES.TLC[LAT] + Z.lat
  const rightBorder = SCREEN_COORDINATES.BRC[LNG] + Z.lng
  const bottomBorder = SCREEN_COORDINATES.BRC[LAT]

  return _northEast.lat >= bottomBorder &&
    _northEast.lat <= topBorder &&
    _northEast.lng >= leftBorder &&
    _northEast.lng <= rightBorder
}

export const setInitCoordinates = (screenBounds) => {
  const { _northEast, _southWest } = screenBounds

  SCREEN_COORDINATES.TLC = [ _northEast.lat, _southWest.lng ]
  SCREEN_COORDINATES.TRC = [ _northEast.lat, _northEast.lng ]
  SCREEN_COORDINATES.BLC = [ _southWest.lat, _southWest.lng ]
  SCREEN_COORDINATES.BRC = [ _southWest.lat, _northEast.lng ]
}

export const removeLayerFromCurrentGrid = (layer) => GRID_DATA.currentGrid.removeLayer(layer)
export const addLayerToCurrentGrid = (layer) => GRID_DATA.currentGrid.addLayer(layer)

export const addLayerToSelectedLayers = (layer) => GRID_DATA.selectedLayers.addLayer(layer)
export const removeLayerFromSelectedLayers = (layer) => GRID_DATA.selectedLayers.removeLayer(layer)
