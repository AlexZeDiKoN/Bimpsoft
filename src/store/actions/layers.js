import { action } from '../../utils/services'
import { layerNameSelector } from '../selectors'
import i18n from '../../i18n'
import { ApiError } from '../../constants/errors'
import { expandMap } from './maps'
import { asyncAction, orgStructures, webMap } from './index'

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
    } else {
      dispatch({
        type: SET_EDIT_MODE,
        editMode,
      })
    }
  })

export const updateLayers = (layersData) => ({
  type: UPDATE_LAYERS,
  layersData,
})

export const updateLayer = (layerData) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { layerSetColor } }) => {
    dispatch({
      type: UPDATE_LAYER,
      layerData,
    })
    if (layerData.hasOwnProperty('color')) {
      await layerSetColor(layerData.layerId, layerData.color)
    }
  })

export const updateLayersByMapId = (mapId, layerData) =>
  asyncAction.withNotification(async (dispatch, getState) => {
    for (const layer of Object.values(getState().layers.byId)) {
      if (layer.mapId === mapId) {
        dispatch(updateLayer({ ...layerData, layerId: layer.layerId }))
      }
    }
  })

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
    const { layers: { selectedId, byId } } = state
    if (selectedId === layerId) {
      return
    }

    await dispatch({
      type: SELECT_LAYER,
      layerId,
    })

    const layer = layerId ? byId[layerId] : null
    if (layer) {
      const { formationId = null, mapId } = layer

      await dispatch(expandMap(mapId, true))

      if (formationId === null) {
        await dispatch(orgStructures.setFormationById(null))
        throw Error('org structure id is undefined')
      }
      await dispatch(orgStructures.setFormationById(formationId))
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

export const deleteLayers = (layersIds) =>
  asyncAction.withNotification(async (dispatch, getState) => {
    const state = getState()
    const { selectedId } = state.layers

    dispatch({
      type: DELETE_LAYERS,
      layersIds,
    })

    if (layersIds.includes(selectedId)) {
      dispatch(selectLayer(null))
    }

    for (const layerId of layersIds) {
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
