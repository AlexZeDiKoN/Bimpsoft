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
export const ADD_OBJECT = Symbol('ADD_OBJECT')
export const DEL_OBJECT = Symbol('DEL_OBJECT')
export const UPD_OBJECT = Symbol('UPD_OBJECT')

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
