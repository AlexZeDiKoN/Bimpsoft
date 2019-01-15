import { latLngBounds } from 'leaflet'
import { GRID_DATA, INIT_GRID_OPTIONS, SELECTED_CELL_OPTIONS } from '../constants'
import {
  addLayerToCurrentGrid,
  addLayerToSelectedLayers,
  removeLayerFromCurrentGrid,
  removeLayerFromSelectedLayers,
} from '../helpers'

// додати листи до групи виділених
const addToSelected = (layer, currentGrid, selectedLayers) => {
  layer.setStyle(SELECTED_CELL_OPTIONS)
  removeLayerFromCurrentGrid(layer, currentGrid)
  addLayerToSelectedLayers(layer, selectedLayers)
}

const addToDeselected = (layer, currentGrid, selectedLayers) => {
  layer.setStyle(INIT_GRID_OPTIONS)
  removeLayerFromSelectedLayers(layer, selectedLayers)
  addLayerToCurrentGrid(layer, currentGrid)
}

// перевірка наявності листа в виділеній зоні
const listVerification = (zone, currentGrid, selectedLayers) => currentGrid.getLayers()
  .concat(selectedLayers.getLayers())
  .forEach((layer) => zone.contains(layer.getCenter())
    ? addToSelected(layer, currentGrid, selectedLayers)
    : addToDeselected(layer, currentGrid, selectedLayers))

// визначення центру зони
const getCenter = (coordinates) => {
  const { _northEast, _southWest } = coordinates
  const lat = _northEast.lat - ((_northEast.lat - _southWest.lat) / 2)
  const lng = _northEast.lng - ((_northEast.lng - _southWest.lng) / 2)
  return { lat, lng }
}

// збільшення виділенної зони (від центру зони)
const increaseZone = (bounds) => {
  const center = getCenter(GRID_DATA.selectedZone)
  bounds._northEast.lat > center.lat + 0.001
    ? GRID_DATA.selectedZone._northEast.lat = bounds._northEast.lat
    : GRID_DATA.selectedZone._southWest.lat = bounds._southWest.lat
  bounds._northEast.lng > center.lng + 0.001
    ? GRID_DATA.selectedZone._northEast.lng = bounds._northEast.lng
    : GRID_DATA.selectedZone._southWest.lng = bounds._southWest.lng
}

// зменшення виділенної зони (від найблищого кута)
const reductionZone = (bounds, point) => {
  const NWDist = +GRID_DATA.selectedZone.getNorthWest().distanceTo(point).toFixed(6)
  const NEDist = +GRID_DATA.selectedZone.getNorthEast().distanceTo(point).toFixed(6)
  const SEDist = +GRID_DATA.selectedZone.getSouthEast().distanceTo(point).toFixed(6)
  const SWDist = +GRID_DATA.selectedZone.getSouthWest().distanceTo(point).toFixed(6)
  const minDist = Math.min(NWDist, NEDist, SEDist, SWDist)
  switch (minDist) {
    case NWDist: {
      GRID_DATA.selectedZone._northEast.lat = bounds._southWest.lat
      GRID_DATA.selectedZone._southWest.lng = bounds._northEast.lng
      break
    }
    case NEDist: {
      GRID_DATA.selectedZone._northEast.lat = bounds._southWest.lat
      GRID_DATA.selectedZone._northEast.lng = bounds._southWest.lng
      break
    }
    case SEDist: {
      GRID_DATA.selectedZone._northEast.lng = bounds._southWest.lng
      GRID_DATA.selectedZone._southWest.lat = bounds._northEast.lat
      break
    }
    case SWDist: {
      GRID_DATA.selectedZone._southWest.lat = bounds._northEast.lat
      GRID_DATA.selectedZone._southWest.lng = bounds._northEast.lng
      break
    }
    default: break
  }
}

// створення і редагування зони покриття
const setSelectedZone = (layer, point) => {
  const bounds = layer.getBounds()
  GRID_DATA.selectedZone
    // перевіряємо чи клік був в середені зони
    ? GRID_DATA.selectedZone.contains(point)
      ? reductionZone(bounds, point)
      : increaseZone(bounds)
    : GRID_DATA.selectedZone = latLngBounds(bounds._northEast, bounds._southWest)
}

export const selectLayer = (event, currentGrid, selectedLayers) => {
  setSelectedZone(event.target, event.latlng)
  listVerification(GRID_DATA.selectedZone, currentGrid, selectedLayers)
  // рахуємо кількість виділених листів, або видаляємо зону при їх відсутності
  selectedLayers.getLayers().length
    ? GRID_DATA.countLists = selectedLayers.getLayers().length
    : GRID_DATA.selectedZone = null
}
