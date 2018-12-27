import { GRID_DATA, INIT_GRID_OPTIONS, SELECTED_CELL_OPTIONS } from '../constants'
import {
  addLayerToCurrentGrid,
  addLayerToSelectedLayers,
  removeLayerFromCurrentGrid,
  removeLayerFromSelectedLayers,
} from '../helpers'

// додати листи до групи виділених
const addToSelected = (layer) => {
  layer.setStyle(SELECTED_CELL_OPTIONS)
  removeLayerFromCurrentGrid(layer)
  addLayerToSelectedLayers(layer)
}

const addToDeselected = (layer) => {
  layer.setStyle(INIT_GRID_OPTIONS)
  removeLayerFromSelectedLayers(layer)
  addLayerToCurrentGrid(layer)
}

// перевірка наявності листа в виділеній зоні
const listVerification = (zone, grid, selected) => grid.getLayers().concat(selected.getLayers())
  .forEach((layer) => zone.contains(layer.getCenter())
    ? addToSelected(layer)
    : addToDeselected(layer))

// визначення центру зони
const getCenter = (coordinates) => {
  const { _northEast, _southWest } = coordinates
  const lat = _northEast.lat - ((_northEast.lat - _southWest.lat) / 2)
  const lng = _northEast.lng - ((_northEast.lng - _southWest.lng) / 2)
  return { lat, lng }
}

// створення і редагування зони покриття
const setSelectedZone = (layer, point) => {
  const bounds = layer.getBounds()
  if (GRID_DATA.selectedZone) {
    const inZone = GRID_DATA.selectedZone.contains(point)
    if (!inZone) {
      const center = getCenter(GRID_DATA.selectedZone)
      bounds._northEast.lat > center.lat + 0.001
        ? GRID_DATA.selectedZone._northEast.lat = bounds._northEast.lat
        : GRID_DATA.selectedZone._southWest.lat = bounds._southWest.lat
      bounds._northEast.lng > center.lng + 0.001
        ? GRID_DATA.selectedZone._northEast.lng = bounds._northEast.lng
        : GRID_DATA.selectedZone._southWest.lng = bounds._southWest.lng
    } else {
      const NWDist = +GRID_DATA.selectedZone.getNorthWest().distanceTo(point).toFixed(6)
      const NEDist = +GRID_DATA.selectedZone.getNorthEast().distanceTo(point).toFixed(6)
      const SEDist = +GRID_DATA.selectedZone.getSouthEast().distanceTo(point).toFixed(6)
      const SWDist = +GRID_DATA.selectedZone.getSouthWest().distanceTo(point).toFixed(6)
      const minDist = Math.min(NWDist, NEDist, SEDist, SWDist)
      if (NWDist === minDist) {
        GRID_DATA.selectedZone._northEast.lat = bounds._southWest.lat
        GRID_DATA.selectedZone._southWest.lng = bounds._northEast.lng
      }
    }
  } else {
    GRID_DATA.selectedZone = bounds
  }
}

export const selectLayer = (event) => {
  setSelectedZone(event.target, event.latlng)
  listVerification(GRID_DATA.selectedZone, GRID_DATA.currentGrid, GRID_DATA.selectedLayers)
}
