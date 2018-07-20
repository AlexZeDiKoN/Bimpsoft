import { asyncAction, orgStructures } from './index'

export const UPDATE_LAYERS = 'UPDATE_LAYERS'
export const UPDATE_LAYER = 'UPDATE_LAYER'
export const SELECT_LAYER = 'SELECT_LAYER'
export const SET_TIMELINE_FROM = 'SET_TIMELINE_FROM'
export const SET_TIMELINE_TO = 'SET_TIMELINE_TO'
export const SET_VISIBLE = 'SET_VISIBLE'
export const SET_BACK_OPACITY = 'SET_BACK_OPACITY'
export const SET_HIDDEN_OPACITY = 'SET_HIDDEN_OPACITY'
export const OBJECT_LIST = Symbol('OBJECT_LIST')

export const updateLayers = (layersData) => ({
  type: UPDATE_LAYERS,
  layersData,
})
export const updateLayer = (layerData) => ({
  type: UPDATE_LAYER,
  layerData,
})

export const selectLayer = (layerId) => asyncAction.withNotification(async (dispatch, getState, { api, webmapApi }) => {
  const objects = await webmapApi.objGetList(layerId)
  api.checkServerResponse(objects)
  dispatch({
    type: OBJECT_LIST,
    payload: {
      layerId,
      objects,
    },
  })
  const content = await api.getAllUnits()
  api.checkServerResponse(content)
  dispatch(orgStructures.set(content))
  dispatch({
    type: SELECT_LAYER,
    layerId,
  })
})

export const setTimelineFrom = (date) => ({
  type: SET_TIMELINE_FROM,
  date,
})
export const setTimelineTo = (date) => ({
  type: SET_TIMELINE_TO,
  date,
})
export const setVisible = (visible) => ({
  type: SET_VISIBLE,
  visible,
})
export const setBackOpacity = (opacity) => ({
  type: SET_BACK_OPACITY,
  opacity,
})
export const setHiddenOpacity = (opacity) => ({
  type: SET_HIDDEN_OPACITY,
  opacity,
})
