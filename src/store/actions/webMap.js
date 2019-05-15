import { batchActions } from 'redux-batched-actions'
import { utils } from '@DZVIN/CommonComponents'
import { MapSources, ZOOMS, paramsNames } from '../../constants'
import { action } from '../../utils/services'
import i18n from '../../i18n'
import { validateObject } from '../../utils/validation'
import entityKind from '../../components/WebMap/entityKind'
import { activeMapSelector } from '../selectors'
import * as notifications from './notifications'
import { asyncAction, flexGrid } from './index'

const { settings } = utils

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
  SET_AMPLIFIERS: action('SET_AMPLIFIERS'),
  SET_GENERALIZATION: action('SET_GENERALIZATION'),
  SET_SOURCES: action('SET_SOURCES'),
  SET_SOURCE: action('SET_SOURCE'),
  SUBORDINATION_LEVEL: action('SUBORDINATION_LEVEL'),
  SUBORDINATION_AUTO: action('SUBORDINATION_AUTO'),
  SET_MAP_CENTER: action('SET_MAP_CENTER'),
  OBJECT_LIST: action('OBJECT_LIST'),
  SET_SCALE_TO_SELECTION: action('SET_SCALE_TO_SELECTION'),
  SET_MARKER: action('SET_MARKER'),
  ADD_OBJECT: action('ADD_OBJECT'),
  DEL_OBJECT: action('DEL_OBJECT'),
  UPD_OBJECT: action('UPD_OBJECT'),
  UPD_ATTR: action('UPD_ATTR'),
  APP_INFO: action('APP_INFO'),
  GET_LOCKED_OBJECTS: action('GET_LOCKED_OBJECTS'),
  OBJECT_LOCKED: action('OBJECT_LOCKED'),
  OBJECT_UNLOCKED: action('OBJECT_UNLOCKED'),
  REFRESH_OBJECT: action('REFRESH_OBJECT'),
  ALLOCATE_OBJECTS_BY_LAYER_ID: action('ALLOCATE_OBJECTS_BY_LAYER_ID'),
  TOGGLE_MEASURE: action('TOGGLE_MEASURE'),
  TOGGLE_MARKERS: action('TOGGLE_MARKERS'),
  TOGGLE_TOPOGRAPHIC_OBJECTS: action('TOGGLE_TOPOGRAPHIC_OBJECTS'),
  GET_TOPOGRAPHIC_OBJECTS: action('GET_TOPOGRAPHIC_OBJECTS'),
  TOGGLE_TOPOGRAPHIC_OBJECTS_MODAL: action('TOGGLE_TOPOGRAPHIC_OBJECTS_MODAL'),
  SELECT_TOPOGRAPHIC_ITEM: action('SELECT_TOPOGRAPHIC_ITEM'),
}

export const setCoordinatesType = (value) => {
  settings.defaultType = value
  return {
    type: actionNames.SET_COORDINATES_TYPE,
    payload: value,
  }
}

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
  payload: value.target.checked,
})

export const setAmplifiers = (value) => ({
  type: actionNames.SET_AMPLIFIERS,
  payload: value.target.checked,
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

export const setSubordinationLevelByZoom = (byZoom = null) => (dispatch, getState) => {
  const { params, webMap: { subordinationAuto, subordinationLevel, zoom } } = getState()
  if (subordinationAuto) {
    if (byZoom === null) {
      byZoom = zoom
    }
    const scale = ZOOMS[byZoom]
    const newSubordinationLevel = params && Number(params[`${paramsNames.SCALE_VIEW_LEVEL}_${scale}`])
    if (newSubordinationLevel && newSubordinationLevel !== subordinationLevel) {
      dispatch(setSubordinationLevel(newSubordinationLevel))
    }
  }
}

export const setSubordinationLevelAuto = (value) => ({
  type: actionNames.SUBORDINATION_AUTO,
  payload: value,
})

export const setCenter = (center, zoom) => ({
  type: actionNames.SET_MAP_CENTER,
  payload: { center, zoom },
})

export const setScaleToSelection = (scaleToSelected) => ({
  type: actionNames.SET_SCALE_TO_SELECTION,
  payload: scaleToSelected,
})

const fixServerObject = ({ unit = null, type = null, ...rest }) => ({
  ...rest,
  unit: unit !== null ? Number(unit) : null,
  type: type !== null ? Number(type) : null,
})

export const addObject = (object) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { objInsert } }) => {
    validateObject(object)

    let payload = await objInsert(object)

    payload = fixServerObject(payload)

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
    const state = getState()
    const { layers: { byId }, webMap: { objects }, flexGrid: { flexGrid: currentGrid } } = state
    if (currentGrid && currentGrid.id === id) {
      const mapId = activeMapSelector(state)
      mapId && await dispatch(flexGrid.getFlexGrid(mapId))
      return
    }
    if (!objects.get(id)) {
      return
    }
    let object = await objRefresh(id)
    if (Number(object.type) === entityKind.FLEXGRID) {
      dispatch({
        type: flexGrid.GET_FLEXGRID,
        payload: object,
      })
    } else if (object.id) {
      const layerId = object.layer
      if (!byId.hasOwnProperty(layerId)) {
        return
      }
      object = fixServerObject(object)
    }
    dispatch({
      type: actionNames.REFRESH_OBJECT,
      payload: { id, object },
    })
  })

export const updateObject = ({ id, ...object }) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { objUpdate } }) => {
    stopHeartBeat()
    validateObject(object)

    let payload = await objUpdate(id, object)

    payload = fixServerObject(payload)

    dispatch({
      type: actionNames.UPD_OBJECT,
      payload,
    })
  })

export const updateObjectsByLayerId = (layerId) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { objGetList } }) => {
    let objects = await objGetList(layerId)

    objects = objects.map(fixServerObject)

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
    stopHeartBeat()
    let payload = await objUpdateGeometry(id, geometry)

    payload = fixServerObject(payload)

    return dispatch({
      type: actionNames.UPD_OBJECT,
      payload,
    })
  })

export const updateObjectAttributes = (id, attributes) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { objUpdateAttr } }) => {
    let payload = await objUpdateAttr(id, attributes)

    payload = fixServerObject(payload)

    return dispatch({
      type: actionNames.UPD_OBJECT,
      payload,
    })
  })

export const updateObjPartially = (id, attributes, geometry) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { objUpdatePartially } }) => {
    let payload = await objUpdatePartially(id, { attributes, ...geometry })

    payload = fixServerObject(payload)

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

export const getMapSources = () =>
  async (dispatch, _, { webmapApi: { getMapSources } }) => {
    try {
      let sources = await getMapSources()
      /* JSON.parse(`[ {
  "title": "ДЗВІН",
  "sources": [ {
    "source": "/tiles/dzvin/{z}/{x}/{y}.png",
    "minZoom": 5,
    "maxZoom": 16
  } ]
}, {
  "title": "Супутник",
  "sources": [ {
    "source": "/tiles/sat/{z}/{x}/{y}.jpg",
    "minZoom": 5,
    "maxZoom": 16,
    "tms": true
  } ]
}, {
  "title": "Ландшафт",
  "sources": [ {
    "source": "/tiles/land/{z}/{x}/{y}.jpg",
    "minZoom": 5,
    "maxZoom": 16,
    "tms": true
  } ]
} ]`) */
      if (!sources || !sources.length || !Array.isArray(sources)) {
        sources = MapSources
      }
      return dispatch({
        type: actionNames.SET_SOURCES,
        payload: {
          sources,
          source: sources[0],
        },
      })
    } catch (error) {
      console.warn(error)
    }
  }

export const objectLocked = (objectId, contactName) => ({
  type: actionNames.OBJECT_LOCKED,
  payload: { objectId, contactName },
})

export const objectUnlocked = (objectId) => ({
  type: actionNames.OBJECT_UNLOCKED,
  payload: { objectId },
})

export const tryLockObject = (objectId) =>
  asyncAction.withNotification(async (dispatch, getState, { webmapApi: { objLock, objUnlock } }) => {
    const { webMap: { lockedObjects } } = getState()
    let lockedBy = lockedObjects.get(objectId)
    let success = false
    if (lockedBy) {
      dispatch(notifications.push({
        type: 'warning',
        message: i18n.EDITING,
        description: `${i18n.OBJECT_EDITING_BY} ${lockedBy}`,
      }))
      dispatch(isObjectStillLocked(objectId))
    } else {
      stopHeartBeat()
      try {
        const result = await objLock(objectId)
        success = result.success
        if (success) {
          lockHeartBeat = setInterval(heartBeat(objLock, objUnlock, objectId), lockHeartBeatInterval * 1000)
        } else {
          lockedBy = result.lockedBy
        }
      } catch (error) {
        console.error(error)
        return false
      }
    }
    return success
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

export const isObjectStillLocked = (objectId) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { objStillLocked } }) => {
    const { still } = await objStillLocked(objectId)
    if (!still) {
      return dispatch({
        type: actionNames.OBJECT_UNLOCKED,
        payload: { objectId },
      })
    }
  })

export const toggleMeasure = () => ({
  type: actionNames.TOGGLE_MEASURE,
})

export const toggleMarkers = () => ({
  type: actionNames.TOGGLE_MARKERS,
})

export const toggleTopographicObjects = () => ({
  type: actionNames.TOGGLE_TOPOGRAPHIC_OBJECTS,
})

export const toggleTopographicObjModal = () => ({
  type: actionNames.TOGGLE_TOPOGRAPHIC_OBJECTS_MODAL,
})

export const selectTopographicItem = (index) => ({
  type: actionNames.SELECT_TOPOGRAPHIC_ITEM,
  payload: index,
})

export const getTopographicObjects = (data) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { getTopographicObjects } }) => {
    const topographicObject = await getTopographicObjects(data)
    dispatch({
      type: actionNames.GET_TOPOGRAPHIC_OBJECTS,
      payload: topographicObject,
    })
  })

// Ініціалізація
window.addEventListener('beforeunload', () => {
  dropLock && dropLock()
  stopHeartBeat()
})
