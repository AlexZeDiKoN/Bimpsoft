import * as R from 'ramda'
import getLoopOrderStartingFromNextValue from './getLoopOrderStartingFromNextValue'

/**
 * Layer type
 *
 * @typedef {{}} Layer
 * @property {string} layerId Layer id
 * @property {string} mapId Map id
 */

/**
 * Get next available layer only in currently selected map
 *
 * @param {Layer[]} allLayers All layers
 * @param {string} currentSelectedLayer Currently selected layer
 * @param {Function} isLayerToInclude Predicate to test if layer should be included
 *
 * @returns {string|null} Returns next layer id if it is exist and available otherwise returns null
 */
export function getNextLayerIdInSelectedMap (allLayers, currentSelectedLayer, isLayerToInclude) {
  const selectedMapId = currentSelectedLayer && currentSelectedLayer.mapId
  const selectedLayerId = currentSelectedLayer && currentSelectedLayer.layerId

  const currentMapLayers = allLayers.filter((layer) => layer.mapId === selectedMapId)
  const currentMapLayersInLoopOrder = getLoopOrderStartingFromNextValue(
    (layer) => layer.layerId === selectedLayerId,
    currentMapLayers,
  )

  const filteredCurrentMapLayersInLoopOrder = currentMapLayersInLoopOrder.filter(isLayerToInclude)
  if (!R.isEmpty(filteredCurrentMapLayersInLoopOrder)) {
    return filteredCurrentMapLayersInLoopOrder[0].layerId
  }

  return null
}

/**
 * Get next available layer in other than selected maps
 *
 * @param {Layer[]} allLayers All layers
 * @param {string} currentSelectedLayer Currently selected layer
 * @param {Function} isLayerToInclude Predicate to test if layer should be included
 *
 * @returns {string|null} Returns next layer id if it is exist and available otherwise returns null
 */
export function getNextLayerIdInNextMap (allLayers, currentSelectedLayer, isLayerToInclude) {
  const allMapsIds = R.compose(
    R.uniq,
    R.map(R.prop('mapId')),
  )(allLayers)

  const selectedMapId = currentSelectedLayer && currentSelectedLayer.mapId
  const mapsIdsInLoopOrder = getLoopOrderStartingFromNextValue(selectedMapId, allMapsIds)

  const nextMapsLayersInLoopOrder = mapsIdsInLoopOrder
    .flatMap((mapId) => allLayers.filter((layer) => layer.mapId === mapId))

  const filteredLayersInLoopOrder = nextMapsLayersInLoopOrder.filter(isLayerToInclude)
  if (!R.isEmpty(filteredLayersInLoopOrder)) {
    return filteredLayersInLoopOrder[0].layerId
  }

  return null
}

/**
 * Get next layer after currently selected
 *
 * @param {object} allLayersById Layers dictionary
 * @param {string} currentSelectedLayerId Currently selected layer id
 * @param {function} [isLayerToExclude=() => false] Predicate to test if layer should be excluded
 *
 * @returns {string|null} Returns next layer id if it is exist and available otherwise returns null
 */
export function getNextLayerId (allLayersById, currentSelectedLayerId, isLayerToExclude = () => false) {
  const currentSelectedLayer = currentSelectedLayerId && allLayersById[currentSelectedLayerId]
  const allLayers = Object.values(allLayersById)
  const isLayerToInclude = R.complement(isLayerToExclude)

  const nextLayerInSelectedMap = getNextLayerIdInSelectedMap(allLayers, currentSelectedLayer, isLayerToInclude)
  if (nextLayerInSelectedMap) {
    return nextLayerInSelectedMap
  }

  return getNextLayerIdInNextMap(allLayers, currentSelectedLayer, isLayerToInclude)
}
