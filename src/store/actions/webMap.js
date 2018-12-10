import { batchActions } from 'redux-batched-actions'
import { ZOOMS, paramsNames } from '../../constants'
import { action } from '../../utils/services'
import i18n from '../../i18n'
import * as notifications from './notifications'
import { asyncAction } from './index'

const lockHeartBeatInterval = 10 // (секунд) Інтервал heart-beat запитів на сервер для утримання локу об'єкта
let lockHeartBeat = null
let dropLock = null

const heartBeat = (objLock, objUnlock, objectId) => {
  dropLock = () => objUnlock(objectId)
  return () => objLock(objectId)
}

const stopHeartBeat = () => {
  if (lockHeartBeat) {
    clearInterval(lockHeartBeat)
    lockHeartBeat = null
    dropLock = null
  }
}

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
  SET_SCALE_TO_SELECTION: action('SET_SCALE_TO_SELECTION'),
  SET_MARKER: action('SET_MARKER'),
  ADD_OBJECT: action('ADD_OBJECT'),
  DEL_OBJECT: action('DEL_OBJECT'),
  UPD_OBJECT: action('UPD_OBJECT'),
  APP_INFO: action('APP_INFO'),
  GET_LOCKED_OBJECTS: action('GET_LOCKED_OBJECTS'),
  OBJECT_LOCKED: action('OBJECT_LOCKED'),
  OBJECT_UNLOCKED: action('OBJECT_UNLOCKED'),
  REFRESH_OBJECT: action('REFRESH_OBJECT'),
  ALLOCATE_OBJECTS_BY_LAYER_ID: action('ALLOCATE_OBJECTS_BY_LAYER_ID'),
}

export const setCoordinatesType = (value) => ({
  type: actionNames.SET_COORDINATES_TYPE,
  payload: value,
})

export const setMarker = (marker) => (dispatch) => {
  const batch = [ {
    type: actionNames.SET_MARKER,
    payload: marker,
  } ]
  marker && batch.push(setCenter(marker.point))
  dispatch(batchActions(batch))
}

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

export const setSubordinationLevelByZoom = (zoom = null) => (dispatch, getState) => {
  const { params, subordinationLevel } = getState()
  const scale = ZOOMS[zoom]
  const newSubordinationLevel = params && Number(params[`${paramsNames.SCALE_VIEW_LEVEL}_${scale}`])
  if (newSubordinationLevel && newSubordinationLevel !== subordinationLevel) {
    dispatch(setSubordinationLevel(newSubordinationLevel))
  }
}

export const setCenter = (center, zoom) => ({
  type: actionNames.SET_MAP_CENTER,
  payload: { center, zoom },
})

export const setScaleToSelection = (scaleToSelected) => ({
  type: actionNames.SET_SCALE_TO_SELECTION,
  payload: scaleToSelected,
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

    return dispatch({
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

export const updateObjectGeometry = (id, geometry) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { objUpdateGeometry } }) => {
    let payload = await objUpdateGeometry(id, geometry)

    // fix response data
    payload = { ...payload, unit: payload.unit ? +payload.unit : null }

    return dispatch({
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
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { objLock, objUnlock } }) => {
    stopHeartBeat()
    try {
      const result = await objLock(objectId)
      if (result.success) {
        lockHeartBeat = setInterval(heartBeat(objLock, objUnlock, objectId), lockHeartBeatInterval * 1000)
      } else {
        dispatch(notifications.push({
          type: 'warning',
          message: i18n.EDITING,
          description: `${i18n.OBJECT_EDITING_BY} ${result.lockedBy}`,
        }))
      }
      return result.success
    } catch (error) {
      console.error(error)
      return false
    }
  })

export const tryUnlockObject = (objectId) =>
  asyncAction.withNotification((_1, _2, { webmapApi: { objUnlock } }) => {
    stopHeartBeat()
    return objUnlock(objectId)
  })

export const getLockedObjects = () =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { lockedObjects } }) => dispatch({
    type: actionNames.GET_LOCKED_OBJECTS,
    payload: await lockedObjects(),
  }))

window.addEventListener('beforeunload', () => {
  dropLock && dropLock()
  stopHeartBeat()
})
