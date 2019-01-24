import { latLngBounds } from 'leaflet'
import { INIT_GRID_OPTIONS, SELECTED_CELL_OPTIONS } from '../constants'
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
const listVerification = (selectedZone, currentGrid, selectedLayers) => currentGrid.getLayers()
  .concat(selectedLayers.getLayers())
  .forEach((layer) => selectedZone.contains(layer.getCenter())
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
const increaseZone = (bounds, selectedZone) => {
  const center = getCenter(selectedZone)
  const newSelectedZone = selectedZone
  bounds._northEast.lat > center.lat + 0.001
    ? newSelectedZone._northEast.lat = bounds._northEast.lat
    : newSelectedZone._southWest.lat = bounds._southWest.lat
  bounds._northEast.lng > center.lng + 0.001
    ? newSelectedZone._northEast.lng = bounds._northEast.lng
    : newSelectedZone._southWest.lng = bounds._southWest.lng
  return newSelectedZone
}

// зменшення виділенної зони (від найблищого кута)
const reductionZone = (bounds, point, selectedZone) => {
  const newSelectedZone = selectedZone
  const NWDist = +newSelectedZone.getNorthWest().distanceTo(point).toFixed(6)
  const NEDist = +newSelectedZone.getNorthEast().distanceTo(point).toFixed(6)
  const SEDist = +newSelectedZone.getSouthEast().distanceTo(point).toFixed(6)
  const SWDist = +newSelectedZone.getSouthWest().distanceTo(point).toFixed(6)
  const minDist = Math.min(NWDist, NEDist, SEDist, SWDist)
  switch (minDist) {
    case NWDist: {
      newSelectedZone._northEast.lat = bounds._southWest.lat
      newSelectedZone._southWest.lng = bounds._northEast.lng
      break
    }
    case NEDist: {
      newSelectedZone._northEast.lat = bounds._southWest.lat
      newSelectedZone._northEast.lng = bounds._southWest.lng
      break
    }
    case SEDist: {
      newSelectedZone._northEast.lng = bounds._southWest.lng
      newSelectedZone._southWest.lat = bounds._northEast.lat
      break
    }
    case SWDist: {
      newSelectedZone._southWest.lat = bounds._northEast.lat
      newSelectedZone._southWest.lng = bounds._northEast.lng
      break
    }
    default: break
  }
  return newSelectedZone
}

// створення і редагування зони покриття
const prepareSelectedZone = (layer, point, selectedZone) => {
  const bounds = layer.getBounds()
  if (selectedZone) {
    const selectedZoneBounds = latLngBounds(selectedZone.northEast, selectedZone.southWest)
    return selectedZoneBounds.contains(point)
      ? reductionZone(bounds, point, selectedZoneBounds)
      : increaseZone(bounds, selectedZoneBounds)
  } else {
    return latLngBounds(bounds._northEast, bounds._southWest)
  }
}

export const selectLayer = (event, currentGrid, selectedLayers, selectedZone, setSelectedZone) => {
  const newSelectedZone = prepareSelectedZone(event.target, event.latlng, selectedZone)
  listVerification(newSelectedZone, currentGrid, selectedLayers)
  setSelectedZone({ northEast: newSelectedZone._northEast, southWest: newSelectedZone._southWest })
  // рахуємо кількість виділених листів, або видаляємо зону при їх відсутності
  selectedLayers.getLayers().length
    ? setSelectedZone({ northEast: newSelectedZone._northEast, southWest: newSelectedZone._southWest })
    : setSelectedZone(null)
}
