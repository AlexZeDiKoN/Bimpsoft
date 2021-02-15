import * as R from 'ramda'
import moment from 'moment'
import { vld } from '@C4/CommonComponents'
import { MapModes, catalogs as catalogsConstants } from '../../constants'
import { action } from '../../utils/services'
import { getNextLayerId } from '../../utils/layers'
import { layerNameSelector, mapNameSelector, signedMap, layersById, selectedLayerId, selectedLayer } from '../selectors'
import i18n from '../../i18n'
import { ApiError } from '../../constants/errors'
import { expandMap } from './maps'
import { actionNames, changeTypes } from './webMap'
import { asyncAction, orgStructures, webMap, selection, flexGrid, maps, catalogs as catalogsActions } from './index'

export const UPDATE_LAYERS = action('UPDATE_LAYERS')
export const UPDATE_LAYER = action('UPDATE_LAYER')
export const DELETE_LAYERS = action('DELETE_LAYERS')
export const DELETE_ALL_LAYERS = action('DELETE_ALL_LAYERS')
export const SELECT_LAYER = action('SELECT_LAYER')
export const SET_EDIT_MODE = action('SET_EDIT_MODE')
export const SET_TIMELINE_FROM = action('SET_TIMELINE_FROM')
export const SET_TIMELINE_TO = action('SET_TIMELINE_TO')
export const SET_BACK_OPACITY = action('SET_BACK_OPACITY')
export const SET_HIDDEN_OPACITY = action('SET_HIDDEN_OPACITY')
export const SET_LAYERS_FILTER_TEXT = action('SET_LAYERS_FILTER_TEXT')

export const setEditMode = (editMode) =>
  asyncAction.withNotification(async (dispatch, getState) => {
    const state = getState()
    const { byId, selectedId } = state.layers

    if (!byId.hasOwnProperty(selectedId)) {
      throw new ApiError(i18n.NO_ACTIVE_LAYER, i18n.CANNOT_ENABLE_EDIT_MODE, true)
    } else if (byId[selectedId].readOnly) {
      const layerName = layerNameSelector(state)
      throw new ApiError(i18n.READ_ONLY_LAYER_ACCESS(layerName), i18n.CANNOT_ENABLE_EDIT_MODE, true)
    } else if (signedMap(state)) {
      const mapName = mapNameSelector(state)
      throw new ApiError(i18n.CANNOT_EDIT_SIGNED_MAP(mapName), i18n.CANNOT_ENABLE_EDIT_MODE, true)
    } else {
      dispatch(webMap.setMapMode(editMode ? MapModes.EDIT : MapModes.NONE))
    }
  })

export const updateLayers = (layersData) => ({
  type: UPDATE_LAYERS,
  layersData,
})

export const updateLayer = (layerData) =>
  asyncAction.withNotification(async (dispatch, getStore, { webmapApi: { layerSetColor } }) => {
    const store = getStore()
    const allLayersById = layersById(store)
    const currentlySelectedLayerId = selectedLayerId(store)
    const isLayerDataHasVisible = Object.prototype.hasOwnProperty.call(layerData, 'visible')
    if (
      currentlySelectedLayerId === layerData.layerId &&
      R.has('visible', layerData) &&
      !layerData.visible
    ) {
      const nextLayerIdToSelect = getNextLayerId(
        allLayersById,
        currentlySelectedLayerId,
        (layer) => !layer.visible,
      )
      dispatch(selectLayer(nextLayerIdToSelect))
    } else if (!currentlySelectedLayerId && layerData.visible) {
      // при отсутствии активного слоя выбираем первый попавшийся слой
      dispatch(selectLayer(layerData.layerId))
    }
    if (catalogsConstants.isCatalogLayer(layerData.layerId) && isLayerDataHasVisible && layerData.visible) {
      await dispatch(catalogsActions.getCatalogAttributesFields(layerData.layerId))
    }

    await dispatch({
      type: UPDATE_LAYER,
      layerData,
    })

    if (layerData.hasOwnProperty('color')) {
      dispatch({
        type: actionNames.ADD_UNDO_RECORD,
        payload: {
          changeType: changeTypes.LAYER_COLOR,
          id: layerData.layerId,
          oldColor: allLayersById[layerData.layerId].color,
          newColor: layerData.color,
        },
      })
      await layerSetColor(layerData.layerId, layerData.color)
    }
    if (layerData.hasOwnProperty('visible') && !layerData.visible) {
      dispatch(selection.clearByLayerId(layerData.layerId))
    }
  })

export const updateLayersByMapId = (mapId, layerData) =>
  asyncAction.withNotification((dispatch, getState) => Promise.all(
    Object.values(getState().layers.byId)
      .filter((layer) => layer.mapId === mapId)
      .map((layer) => dispatch(updateLayer({ ...layerData, layerId: layer.layerId }))),
  ))

export const updateAllLayers = (layerData) =>
  asyncAction.withNotification(async (dispatch, getState) => {
    for (const layer of Object.values(getState().layers.byId)) {
      dispatch(updateLayer({ ...layerData, layerId: layer.layerId }))
    }
  })

export const updateColorByLayerId = (layerId) =>
  asyncAction.withNotification(async (dispatch, getState, { webmapApi: { layerGetColor } }) => {
    if (getState().layers.byId.hasOwnProperty(layerId)) {
      const color = await layerGetColor(layerId)
      const layerData = { layerId, color }
      dispatch({
        type: UPDATE_LAYER,
        layerData,
      })
    }
  })

export const selectLayer = (layerId) =>
  asyncAction.withNotification(async (dispatch, getState) => {
    const state = getState()

    const {
      layers: {
        selectedId,
        byId,
      },
      webMap: { mode },
    } = state
    if (selectedId === layerId) {
      return
    }

    await dispatch({
      type: SELECT_LAYER,
      layerId,
    })

    const layer = layerId ? byId[layerId] : null

    if (layer) {
      const {
        formationId = null,
        mapId,
      } = layer

      if (state.flexGrid.visible) {
        await dispatch(flexGrid.getFlexGrid(mapId))
      }

      await dispatch(expandMap(mapId, true))

      if (formationId === null) {
        await dispatch(orgStructures.setFormationById(null))
        throw Error('org structure id is undefined')
      }

      await dispatch(orgStructures.setFormationById(formationId))

      if (layer.readOnly && mode === MapModes.EDIT) {
        dispatch(webMap.setMapMode(MapModes.NONE))
      }
    } else {
      await dispatch(orgStructures.setFormationById(null))
    }
  })

export const deleteLayersByMapId = (mapId) =>
  asyncAction.withNotification(async (dispatch, getState) => {
    const state = getState()
    const { byId } = state.layers

    const layersIds = Object.values(byId).filter((layer) => layer.mapId === mapId).map((layer) => layer.layerId)

    dispatch(deleteLayers(layersIds))
  })

export const deleteLayers = (layersIdsToDelete) =>
  asyncAction.withNotification(async (dispatch, getStore) => {
    const store = getStore()
    const allLayersById = layersById(store)
    const currentlySelectedLayerId = selectedLayerId(store)

    if (layersIdsToDelete.includes(currentlySelectedLayerId)) {
      const nextLayerIdToSelect = getNextLayerId(
        allLayersById,
        currentlySelectedLayerId,
        (layer) => !layer.visible || layersIdsToDelete.includes(layer.layerId),
      )
      dispatch(selectLayer(nextLayerIdToSelect))
    }

    dispatch({
      type: DELETE_LAYERS,
      layersIds: layersIdsToDelete,
    })

    for (const layerId of layersIdsToDelete) {
      dispatch(webMap.allocateObjectsByLayerId(layerId))
    }
  })

export const deleteAllLayers = () =>
  asyncAction.withNotification(async (dispatch, getState) => {
    const state = getState()
    const { byId } = state.layers
    const layersIds = Object.keys(byId)
    for (const layerId of layersIds) {
      dispatch(webMap.allocateObjectsByLayerId(layerId))
    }
    dispatch({ type: DELETE_ALL_LAYERS })
    dispatch(selectLayer(null))
  })

export const setTimelineFrom = (date) => ({
  type: SET_TIMELINE_FROM,
  date,
})

export const setTimelineTo = (date) => ({
  type: SET_TIMELINE_TO,
  date,
})

export const setBackOpacity = (opacity) => ({
  type: SET_BACK_OPACITY,
  opacity,
})

export const setHiddenOpacity = (opacity) => ({
  type: SET_HIDDEN_OPACITY,
  opacity,
})

export const setFilterText = (filterText) => ({
  type: SET_LAYERS_FILTER_TEXT,
  filterText,
})

export const createLayer = (data) => asyncAction.withNotification(async (dispatch, getState, { nodeApi }) => {
  const validation = vld.validate({
    name: R.pipe(vld.defined, vld.notNull, vld.text(1, 200)),
    dateFor: moment.isMoment,
  }, data)
  if (!vld.isValid(validation)) {
    return { errors: validation.messages, success: false, payload: null }
  }
  const state = getState()
  const formationId = state?.orgStructures?.formation?.id
  const mapId = selectedLayer(state)?.mapId
  const createLayerResponse = await nodeApi.addMapLayer({
    formationId,
    mapId,
    name: data.name,
    dateFor: data.dateFor || moment(),
  })
  const success = createLayerResponse?.data?.code === 2000
  const payload = createLayerResponse?.data?.message?.id
  success && await dispatch(maps.openMapFolder(mapId, payload))
  return { errors: {}, success, payload }
})
