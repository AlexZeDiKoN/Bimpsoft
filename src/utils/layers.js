import * as R from 'ramda'
import getLoopOrderStartingFromNextValue from './getLoopOrderStartingFromNextValue'

/**
 * Layer type
 *
 * @typedef {{}} Layer
 * @property {String} layerId Layer id
 * @property {String} mapId Map id
 */

/**
 * Get next available layer only in currently selected map
 *
 * @param {Object<String, Layer>} allLayersById All layers by id
 * @param {String} currentSelectedLayerId Currently selected layer id
 * @param {Function} [isLayerToExclude=R.F] Predicate to test if layer should be excluded
 *
 * @returns {String|null} Returns next layer id if it is exist and available otherwise returns null
 */
export function getNextLayerIdInSelectedMap (allLayersById, currentSelectedLayerId, isLayerToExclude = R.F) {
  const currentSelectedLayer = currentSelectedLayerId && allLayersById[currentSelectedLayerId]
  const allLayers = Object.values(allLayersById)

  if (R.isNil(currentSelectedLayer)) {
    return null
  }

  const currentMapLayers = allLayers.filter((layer) => layer.mapId === currentSelectedLayer.mapId)
  const currentMapLayersInLoopOrder = getLoopOrderStartingFromNextValue(
    (layer) => layer.layerId === currentSelectedLayer.layerId,
    currentMapLayers,
  )

  const isLayerToInclude = R.complement(isLayerToExclude)
  const filteredCurrentMapLayersInLoopOrder = currentMapLayersInLoopOrder.filter(isLayerToInclude)
  if (!R.isEmpty(filteredCurrentMapLayersInLoopOrder)) {
    return filteredCurrentMapLayersInLoopOrder[0].layerId
  }

  return null
}

/**
 * Get next available layer in other than selected maps
 *
 * @param {Object<String, Layer>} allLayersById All layers by id
 * @param {String} currentSelectedLayerId Currently selected layer id
 * @param {Function} [isLayerToExclude=R.F] Predicate to test if layer should be excluded
 *
 * @returns {String|null} Returns next layer id if it is exist and available otherwise returns null
 */
export function getNextLayerIdInNextMap (allLayersById, currentSelectedLayerId, isLayerToExclude = R.F) {
  const currentSelectedLayer = currentSelectedLayerId && allLayersById[currentSelectedLayerId]
  const allLayers = Object.values(allLayersById)

  const allMapsIds = R.compose(
    R.uniq,
    R.map(R.prop('mapId')),
  )(allLayers)

  const mapsIdsInLoopOrder = currentSelectedLayer
    ? getLoopOrderStartingFromNextValue(currentSelectedLayer.mapId, allMapsIds)
    : allMapsIds

  const nextMapsLayersInLoopOrder = R.compose(
    R.flatten,
    R.map((mapId) => allLayers.filter((layer) => layer.mapId === mapId)),
  )(mapsIdsInLoopOrder)

  const isLayerToInclude = R.complement(isLayerToExclude)
  const filteredLayersInLoopOrder = nextMapsLayersInLoopOrder.filter(isLayerToInclude)
  if (!R.isEmpty(filteredLayersInLoopOrder)) {
    return filteredLayersInLoopOrder[0].layerId
  }

  return null
}

/**
 * Get next layer after currently selected
 *
 * @param {Object<String, Layer>} allLayersById Layers dictionary
 * @param {String} currentSelectedLayerId Currently selected layer id
 * @param {Function} [isLayerToExclude] Predicate to test if layer should be excluded
 *
 * @returns {String|null} Returns next layer id if it is exist and available otherwise returns null
 */
export function getNextLayerId (allLayersById, currentSelectedLayerId, isLayerToExclude) {
  const nextLayerInSelectedMap = getNextLayerIdInSelectedMap(allLayersById, currentSelectedLayerId, isLayerToExclude)

  if (nextLayerInSelectedMap) {
    return nextLayerInSelectedMap
  }

  return getNextLayerIdInNextMap(allLayersById, currentSelectedLayerId, isLayerToExclude)
}
