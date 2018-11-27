import { action } from '../../utils/services'
import { asyncAction } from './index'

const lockHeartBeatInterval = 10 // (секунд) Інтервал heart-beat запитів на сервер для утримання локу об'єкта
let lockHeartBeat = null

const heartBeat = (objLock, objectId) => () => objLock(objectId)

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
  APP_INFO: action('APP_INFO'),
  OBJECT_LOCKED: action('OBJECT_LOCKED'),
  OBJECT_UNLOCKED: action('OBJECT_UNLOCKED'),
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

export const setCenter = (center, zoom, params) => ({
  type: actionNames.SET_MAP_CENTER,
  payload: { center, zoom, params },
})

export const addObject = (object) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { objInsert } }) => {
    let payload = await objInsert(object)

    // fix response data
    payload = { ...payload, unit: payload.unit ? +payload.unit : null }

    dispatch({
      type: actionNames.ADD_OBJECT,
      payload,
    })
    return payload.id
  })

export const deleteObject = (id) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { objDelete } }) => {
    await objDelete(id)
    dispatch({
      type: actionNames.DEL_OBJECT,
      payload: id,
    })
  })

export const refreshObject = (id) =>
  asyncAction.withNotification(async (dispatch, getState, { webmapApi: { objRefresh } }) => {
    let object = await objRefresh(id)

    if (object.id) {
      const { layers: { byId } } = getState()
      const layerId = object.layer
      if (!byId.hasOwnProperty(layerId)) {
        return
      }

      // fix response data
      object = { ...object, unit: object.unit ? +object.unit : null }
    }

    dispatch({
      type: actionNames.REFRESH_OBJECT,
      payload: { id, object },
    })
  })

export const updateObject = ({ id, ...object }) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { objUpdate } }) => {
    let payload = await objUpdate(id, object)

    // fix response data
    payload = { ...payload, unit: payload.unit ? +payload.unit : null }

    dispatch({
      type: actionNames.UPD_OBJECT,
      payload,
    })
  })

export const updateObjectsByLayerId = (layerId) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { objGetList } }) => {
    let objects = await objGetList(layerId)

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
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { objUpdateGeometry } }) => {
    let payload = await objUpdateGeometry(id, object)

    // fix response data
    payload = { ...payload, unit: payload.unit ? +payload.unit : null }

    dispatch({
      type: actionNames.UPD_OBJECT,
      payload,
    })
  })

export const getAppInfo = () =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { getVersion, getContactId } }) => {
    const [ version, contactId ] = await Promise.all([ getVersion(), getContactId() ])
    return dispatch({
      type: actionNames.APP_INFO,
      payload: { version, contactId },
    })
  })

export const objectLocked = (objectId, contactName) => ({
  type: actionNames.OBJECT_LOCKED,
  payload: { objectId, contactName },
})

export const objectUnlocked = (objectId) => ({
  type: actionNames.OBJECT_UNLOCKED,
  payload: { objectId },
})

export const tryLockObject = (objectId) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { objLock } }) => {
    lockHeartBeat && clearInterval(lockHeartBeat)
    lockHeartBeat = setInterval(heartBeat(objLock, objectId), lockHeartBeatInterval * 1000)
    try {
      return (await objLock(objectId)).success
    } catch (error) {
      console.error(error)
      return false
    }
  })

export const tryUnlockObject = (objectId) =>
  asyncAction.withNotification((_1, _2, { webmapApi: { objUnlock } }) => {
    lockHeartBeat && clearInterval(lockHeartBeat)
    lockHeartBeat = null
    return objUnlock(objectId)
  })
