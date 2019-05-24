import { action } from '../../utils/services'
import { updateColorByLayerId } from './layers'
import { asyncAction, maps, layers, webMap, flexGrid } from './index'

export const UPDATE_MAP = action('UPDATE_MAP')
export const DELETE_MAP = action('DELETE_MAP')
export const DELETE_ALL_MAPS = action('DELETE_ALL_MAPS')
export const EXPAND_MAP = action('EXPAND_MAP')
export const SET_CALC_VARIANT = action('SET_CALC_VARIANT')

export const updateMap = (mapData) => ({
  type: UPDATE_MAP,
  mapData,
})

export const deleteMap = (mapId) => asyncAction.withNotification(
  async (dispatch) => {
    dispatch({
      type: DELETE_MAP,
      mapId,
    })
    dispatch(layers.deleteLayersByMapId(mapId))
  }
)

export const deleteAllMaps = () => asyncAction.withNotification(
  async (dispatch) => {
    dispatch({
      type: DELETE_ALL_MAPS,
    })
    dispatch(layers.deleteAllLayers())
  }
)

export const setVariant = (mapId, variantId) => ({
  type: SET_CALC_VARIANT,
  payload: { mapId, variantId },
})

export const cancelVariant = (variantId = null) => ({
  type: SET_CALC_VARIANT,
  payload: { mapId: null, variantId },
})

export const clearVariant = (variantId = null, fromExplorer = false) => {
  if (!fromExplorer) {
    window.explorerBridge.cancelVariant(variantId)
  }
  return cancelVariant(variantId)
}

export const openMapFolderVariant = (mapId, variantId) => async (dispatch) => {
  await dispatch(setVariant(mapId, variantId))
  return dispatch(openMapFolder(mapId, null, true))
}

export const openMapFolder = (mapId, layerId = null, showFlexGrid = false) => asyncAction.withNotification(
  async (dispatch, _, { webmapApi: { getMap } }) => {
    const content = await getMap(mapId)
    const {
      layers: entities,
      map: {
        id,
        name,
        doc_confirm: docConfirm,
        security_classification: securityClassification,
      },
      approversData,
      // breadcrumbs,
    } = content

    await dispatch(maps.updateMap({
      mapId: id,
      name,
      // breadcrumbs,
      docConfirm,
      approversData,
      securityClassification,
    }))
    const layersData = entities.map(({ id, id_map, name, date_for, id_formation, readOnly }) => ({ // eslint-disable-line camelcase
      mapId: id_map,
      layerId: id,
      name,
      dateFor: date_for,
      formationId: id_formation,
      readOnly,
    }))
    await dispatch(layers.updateLayers(layersData))
    for (const { layerId } of layersData) {
      await dispatch(webMap.updateObjectsByLayerId(layerId))
      await dispatch(updateColorByLayerId(layerId))
    }
    if (layersData.length > 0) {
      let selectedLayer
      if (layerId === null) {
        selectedLayer = layersData[0]
      } else {
        selectedLayer = layersData.find((layer) => layer.layerId === layerId)
      }
      if (selectedLayer) {
        await dispatch(layers.selectLayer(selectedLayer.layerId))
      }
    }
    await dispatch(flexGrid.getFlexGrid(mapId, showFlexGrid))
  }
)

export const expandMap = (id, expand) => ({
  type: EXPAND_MAP,
  id,
  expand,
})

export const toggleExpandMap = (id) =>
  (dispatch, getState) => dispatch(expandMap(id, !getState().maps.expandedIds.hasOwnProperty(id)))
