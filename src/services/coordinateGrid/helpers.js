import { CELL_SIZES, LAT, LNG } from './constants'

export const isAreaOnScreen = (_northEast, scale, screenCoordinates) => {
  const Z = CELL_SIZES[scale]
  const leftBorder = screenCoordinates.TLC[LNG]
  const topBorder = screenCoordinates.TLC[LAT] + Z.lat
  const rightBorder = screenCoordinates.BRC[LNG] + Z.lng
  const bottomBorder = screenCoordinates.BRC[LAT]

  return _northEast.lat >= bottomBorder &&
    _northEast.lat <= topBorder &&
    _northEast.lng >= leftBorder &&
    _northEast.lng <= rightBorder
}

export const setInitCoordinates = (screenBounds) => {
  const { _northEast, _southWest } = screenBounds
  const screenCoordinates = {}

  screenCoordinates.TLC = [ _northEast.lat, _southWest.lng ]
  screenCoordinates.TRC = [ _northEast.lat, _northEast.lng ]
  screenCoordinates.BLC = [ _southWest.lat, _southWest.lng ]
  screenCoordinates.BRC = [ _southWest.lat, _northEast.lng ]

  return screenCoordinates
}

export const removeLayerFromCurrentGrid = (layer, currentGrid) => currentGrid.removeLayer(layer)
export const addLayerToCurrentGrid = (layer, currentGrid) => currentGrid.addLayer(layer)

export const addLayerToSelectedLayers = (layer, selectedLayers) => selectedLayers.addLayer(layer)
export const removeLayerFromSelectedLayers = (layer, selectedLayers) => selectedLayers.removeLayer(layer)
