import { action } from '../../utils/services'
import { asyncAction } from './index'

export const actionNames = {
  SET_COORDINATES_TYPE: action('SET_COORDINATES_TYPE'),
  SET_MINIMAP: action('SET_MINIMAP'),
  SET_MEASURE: action('SET_MEASURE'),
  SET_AMPLIFIERS: action('SET_AMPLIFIERS'),
  SET_GENERALIZATION: action('SET_GENERALIZATION'),
  SET_SOURCE: action('SET_SOURCE'),
  SUBORDINATION_LEVEL: action('SUBORDINATION_LEVEL'),
  SET_MAP_CENTER: action('SET_MAP_CENTER'),
  OBJECT_LIST: action('OBJECT_LIST'),
  ADD_OBJECT: action('ADD_OBJECT'),
  DEL_OBJECT: action('DEL_OBJECT'),
  UPD_OBJECT: action('UPD_OBJECT'),
  REFRESH_OBJECT: action('REFRESH_OBJECT'),
  ALLOCATE_OBJECTS_BY_LAYER_ID: action('ALLOCATE_OBJECTS_BY_LAYER_ID'),
}

export const setCoordinatesType = (value) => ({
  type: actionNames.SET_COORDINATES_TYPE,
  payload: value,
})

export const setMiniMap = (value) => ({
  type: actionNames.SET_MINIMAP,
  payload: value,
})

export const setMeasure = (value) => ({
  type: actionNames.SET_MEASURE,
  payload: value,
})

export const setAmplifiers = (value) => ({
  type: actionNames.SET_AMPLIFIERS,
  payload: value,
})

export const setGeneralization = (value) => ({
  type: actionNames.SET_GENERALIZATION,
  payload: value,
})

export const setSource = (value) => ({
  type: actionNames.SET_SOURCE,
  payload: value,
})

export const setSubordinationLevel = (value) => ({
  type: actionNames.SUBORDINATION_LEVEL,
  payload: value,
})

export const setCenter = (center) => ({
  type: actionNames.SET_MAP_CENTER,
  payload: center,
})

export const addObject = (object) =>
  asyncAction.withNotification(async (dispatch, _, { api, webmapApi }) => {
    let payload = await webmapApi.objInsert(object)
    api.checkServerResponse(payload)

    // fix response data
    payload = { ...payload, unit: payload.unit ? +payload.unit : null }

    dispatch({
      type: actionNames.ADD_OBJECT,
      payload,
    })
    return payload.id
  })

export const deleteObject = (id) =>
  asyncAction.withNotification(async (dispatch, _, { api, webmapApi }) => {
    const success = await webmapApi.objDelete(id)
    api.checkServerResponse(success)
    dispatch({
      type: actionNames.DEL_OBJECT,
      payload: id,
    })
  })

export const refreshObject = (id) =>
  asyncAction.withNotification(async (dispatch, _, { api, webmapApi }) => {
    let object = await webmapApi.objRefresh(id)
    api.checkServerResponse(object)

    // fix response data
    if (object.id) {
      object = { ...object, unit: object.unit ? +object.unit : null }
    }

    dispatch({
      type: actionNames.REFRESH_OBJECT,
      payload: { id, object },
    })
  })

export const updateObject = ({ id, ...object }) =>
  asyncAction.withNotification(async (dispatch, _, { api, webmapApi }) => {
    let payload = await webmapApi.objUpdate(id, object)
    api.checkServerResponse(payload)

    // fix response data
    payload = { ...payload, unit: payload.unit ? +payload.unit : null }

    dispatch({
      type: actionNames.UPD_OBJECT,
      payload,
    })
  })

export const updateObjectsByLayerId = (layerId) =>
  asyncAction.withNotification(async (dispatch, _, { api, webmapApi }) => {
    let objects = await webmapApi.objGetList(layerId)
    api.checkServerResponse(objects)

    // fix response data
    objects = objects.map(({ unit, ...rest }) => ({ ...rest, unit: unit ? +unit : null }))

    dispatch({
      type: actionNames.OBJECT_LIST,
      payload: {
        layerId,
        objects,
      },
    })
  })

export const allocateObjectsByLayerId = (layerId) => ({
  type: actionNames.ALLOCATE_OBJECTS_BY_LAYER_ID,
  payload: layerId,
})

export const updateObjectGeometry = ({ id, ...object }) =>
  asyncAction.withNotification(async (dispatch, _, { api, webmapApi }) => {
    let payload = await webmapApi.objUpdateGeometry(id, object)
    api.checkServerResponse(payload)

    // fix response data
    payload = { ...payload, unit: payload.unit ? +payload.unit : null }

    dispatch({
      type: actionNames.UPD_OBJECT,
      payload,
    })
  })
