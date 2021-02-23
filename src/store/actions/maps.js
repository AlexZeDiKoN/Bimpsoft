import { batchActions } from 'redux-batched-actions'
import { action } from '../../utils/services'
import i18n from '../../i18n'
import { isCatalogMapFunc } from '../selectors'
import { asyncAction, maps, layers, webMap, flexGrid, selection, orgStructures, catalogs } from './index'

const MAP_FORCED_UPDATE_INTERVAL = 30 // seconds

export const UPDATE_MAP = action('UPDATE_MAP')
export const DELETE_MAP = action('DELETE_MAP')
export const DELETE_ALL_MAPS = action('DELETE_ALL_MAPS')
export const EXPAND_MAP = action('EXPAND_MAP')
export const CLOSE_MAP_SECTIONS = action('CLOSE_MAP_SECTIONS')
export const SET_CALC_VARIANT = action('SET_CALC_VARIANT')
export const SET_MAP_LOADING = action('SET_MAP_LOADING')

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
    dispatch(webMap.toggleReportMapModal(false, { mapId }))
  },
)

export const deleteAllMaps = () => asyncAction.withNotification(
  async (dispatch) => {
    dispatch({
      type: DELETE_ALL_MAPS,
    })
    dispatch(layers.deleteAllLayers())
  },
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
    window.explorerBridge.openedVariantMapId = null
  }
  return cancelVariant(variantId)
}

export const openMapFolderVariant = (mapId, variantId) => async (dispatch) => {
  await dispatch(setVariant(mapId, variantId))
  return dispatch(openMapFolder(mapId, null, true))
}

export const openMapByCoord = (mapId, coordinate) => async (dispatch) => {
  const actions = [ ]
  mapId && actions.push(openMapFolder(mapId))
  coordinate && actions.push(webMap.setMarker({
    text: i18n.TASK,
    point: { lng: parseFloat(coordinate.lng), lat: parseFloat(coordinate.lat) },
  }))
  await dispatch(batchActions(actions))
}

export const openMapByObject = (mapId, objectData) => async (dispatch, getState) => {
  if (!objectData) {
    return
  }
  const { id, layer } = objectData
  layer && await dispatch(openMapFolder(mapId, layer))
  if (id) {
    const state = getState()
    const { webMap: { objects } } = state
    const object = objects.get(id)
    if (object) {
      const actions = [
        webMap.setScaleToSelection(false),
        selection.selectedList([ id ]),
      ]
      const { point } = object
      point && actions.push(webMap.setCenter({ lng: parseFloat(point.lng), lat: parseFloat(point.lat) }))
      await dispatch(batchActions(actions))
    }
  }
}

export const openMapFolder = (mapId, layerId = null, showFlexGrid = false) => asyncAction.withNotification(
  async (dispatch, getState, { webmapApi: { getMap } }) => {
    await dispatch(catalogs.loadCatalogsMetaIfNotExist())

    const content = await getMap(mapId)
    const {
      layers: entities,
      map: {
        id,
        name,
        signed,
        doc_confirm: docConfirm,
        security_classification: securityClassification,
      },
      approversData,
      isCOP,
      // breadcrumbs,
    } = content
    const state = getState()
    const { webMap: { unitId } } = state

    const mapData = {
      mapId: id,
      name,
      isCOP,
      signed,
      // breadcrumbs,
      docConfirm,
      approversData,
      securityClassification,
    }

    if (isCOP) {
      // Примусовий таймер оновлення
      mapData.refreshTimer = setInterval(
        async () => {
          try {
            await Promise.all(layersData.map(({ layerId }) => dispatch(webMap.updateObjectsByLayerId(layerId))))
          } catch (err) {
            console.error(err)
          }
        },
        MAP_FORCED_UPDATE_INTERVAL * 1000,
      )
    }

    if (!global.lockRefreshTimer) {
      global.lockRefreshTimer = setInterval(
        async () => {
          try {
            await webMap.getLockedObjects()
          } catch (err) {
            console.error(err)
          }
        },
        MAP_FORCED_UPDATE_INTERVAL * 1000,
      )
    }

    await dispatch(maps.updateMap(mapData))
    const layersData = entities.map(({ id, id_map, name, date_for, id_formation, readOnly }) => ({ // eslint-disable-line camelcase
      mapId: id_map,
      layerId: id,
      name,
      dateFor: date_for,
      formationId: id_formation,
      readOnly,
    })).sort((layer1, layer2) => { // сортировка слоев карты
      const dateFor1 = Date.parse(layer1.dateFor)
      const dateFor2 = Date.parse(layer2.dateFor)
      if ((dateFor1 === dateFor2) || isCOP) { // сортировка по названию слоев
        return (layer1.name.toLowerCase()).localeCompare(layer2.name.toLowerCase())
      }
      return dateFor2 - dateFor1 // сортировка по "станом на"
    })

    const isMapCatalog = isCatalogMapFunc(getState())(mapId)
    await dispatch(layers.updateLayers(layersData, { isMapCatalog }))
    for (const { layerId } of layersData) {
      await dispatch(webMap.updateObjectsByLayerId(layerId))
      await dispatch(layers.updateColorByLayerId(layerId))
    }

    if (layersData.length > 0) {
      const selectedLayer = layersData.find((layer) => layer.layerId === layerId) || layersData[0]

      if (selectedLayer) {
        await dispatch(layers.selectLayer(selectedLayer.layerId))
        dispatch(orgStructures.expandTreeByOrgStructureItem(unitId))
        dispatch(orgStructures.setOrgStructureSelectedId(unitId))
      }
    }
    await dispatch(flexGrid.getFlexGrid(mapId, showFlexGrid))
  },
)

export const expandMap = (id, expand) => ({
  type: EXPAND_MAP,
  id,
  expand,
})

export const closeMapSections = (mapsCollapsed) => ({
  type: CLOSE_MAP_SECTIONS,
  mapsCollapsed,
})

export const toggleExpandMap = (id) => (dispatch, getState) =>
  dispatch(expandMap(id, !Object.prototype.hasOwnProperty.call(getState().maps.expandedIds, id)))

export const setStatusMapLoading = (loadingMap) => ({
  type: SET_MAP_LOADING,
  loadingMap,
})
