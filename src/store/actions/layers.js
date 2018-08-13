import { action } from '../../utils/services'
import { asyncAction, orgStructures } from './index'

export const UPDATE_LAYERS = action('UPDATE_LAYERS')
export const UPDATE_LAYER = action('UPDATE_LAYER')
export const SELECT_LAYER = action('SELECT_LAYER')
export const SET_TIMELINE_FROM = action('SET_TIMELINE_FROM')
export const SET_TIMELINE_TO = action('SET_TIMELINE_TO')
export const SET_VISIBLE = action('SET_VISIBLE')
export const SET_BACK_OPACITY = action('SET_BACK_OPACITY')
export const SET_HIDDEN_OPACITY = action('SET_HIDDEN_OPACITY')
export const OBJECT_LIST = action('OBJECT_LIST')
export const ADD_OBJECT = action('ADD_OBJECT')
export const DEL_OBJECT = action('DEL_OBJECT')
export const UPD_OBJECT = action('UPD_OBJECT')

export const updateLayers = (layersData) => ({
  type: UPDATE_LAYERS,
  layersData,
})
export const updateLayer = (layerData) => ({
  type: UPDATE_LAYER,
  layerData,
})

export const selectLayer = (layerId) =>
  asyncAction.withNotification(async (dispatch, getState, { api, webmapApi }) => {
    const objects = await webmapApi.objGetList(layerId)
    api.checkServerResponse(objects)
    dispatch({
      type: OBJECT_LIST,
      payload: {
        layerId,
        objects,
      },
    })
    if (layerId) {
      const content = await api.getAllUnits()
      api.checkServerResponse(content)
      dispatch(orgStructures.set(content))
      dispatch({
        type: SELECT_LAYER,
        layerId,
      })
    }
  })

export const addObject = (object) =>
  asyncAction.withNotification(async (dispatch, getState, { api, webmapApi }) => {
    const payload = await webmapApi.objInsert(object)
    api.checkServerResponse(payload)
    dispatch({
      type: ADD_OBJECT,
      payload,
    })
    return payload.id
  })

export const deleteObject = (id) =>
  asyncAction.withNotification(async (dispatch, getState, { api, webmapApi }) => {
    const success = await webmapApi.objDelete(id)
    api.checkServerResponse(success)
    dispatch({
      type: DEL_OBJECT,
      payload: id,
    })
  })

export const updateObject = ({ id, ...object }) =>
  asyncAction.withNotification(async (dispatch, getState, { api, webmapApi }) => {
    const payload = await webmapApi.objUpdate(id, object)
    api.checkServerResponse(payload)
    dispatch({
      type: UPD_OBJECT,
      payload,
    })
  })

export const updateObjectGeometry = ({ id, ...object }) =>
  asyncAction.withNotification(async (dispatch, getState, { api, webmapApi }) => {
    const payload = await webmapApi.objUpdateGeometry(id, object)
    api.checkServerResponse(payload)
    dispatch({
      type: UPD_OBJECT,
      payload,
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
