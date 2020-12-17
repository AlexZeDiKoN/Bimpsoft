import { batchActions } from 'redux-batched-actions'
import { utils } from '@C4/CommonComponents'
import moment from 'moment'
import { MapSources, ZOOMS, paramsNames, access } from '../../constants'
import { action } from '../../utils/services'
import i18n from '../../i18n'
import { validateObject } from '../../utils/validation'
import { useArraysIn } from '../../utils/immutable'
import entityKind from '../../components/WebMap/entityKind'
import { activeMapSelector } from '../selectors'
import * as viewModesKeys from '../../constants/viewModesKeys'
import { amps } from '../../constants/symbols'
import { getFormationInfo, reloadUnits } from './orgStructures'
import * as notifications from './notifications'
import { asyncAction, flexGrid, layers, selection, changeLog } from './'

const { settings } = utils

const lockHeartBeatInterval = 10 // (секунд) Інтервал heart-beat запитів на сервер для утримання локу об'єкта
let lockHeartBeat = null
let dropLock = null

const heartBeat = (objLock, objUnlock, objectId) => {
  dropLock = () => objUnlock(objectId)
  return () => objLock(objectId)
    .catch(console.error)
}

export const stopHeartBeat = () => {
  if (lockHeartBeat) {
    clearInterval(lockHeartBeat)
    lockHeartBeat = null
    dropLock = null
  }
}
export const actionNames = {
  SET_MAP_MODE: action('SET_MAP_MODE'),
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
  OBJECT_LIST_REFRESH: action('OBJECT_LIST_REFRESH'),
  RETURN_UNIT_INDICATORS: action('RETURN_UNIT_INDICATORS'),
  SET_SCALE_TO_SELECTION: action('SET_SCALE_TO_SELECTION'),
  SET_MARKER: action('SET_MARKER'),
  ADD_OBJECT: action('ADD_OBJECT'),
  DEL_OBJECT: action('DEL_OBJECT'),
  DEL_OBJECTS: action('DEL_OBJECTS'),
  UPD_OBJECT: action('UPD_OBJECT'),
  UPD_ATTR: action('UPD_ATTR'),
  APP_INFO: action('APP_INFO'),
  GET_LOCKED_OBJECTS: action('GET_LOCKED_OBJECTS'),
  OBJECT_LOCKED: action('OBJECT_LOCKED'),
  OBJECT_UNLOCKED: action('OBJECT_UNLOCKED'),
  REFRESH_OBJECT: action('REFRESH_OBJECT'),
  ALLOCATE_OBJECTS_BY_LAYER_ID: action('ALLOCATE_OBJECTS_BY_LAYER_ID'),
  TOGGLE_MEASURE: action('TOGGLE_MEASURE'),
  TOGGLE_ZONE_PROFILE: action('TOGGLE_ZONE_PROFILE'),
  TOGGLE_ZONE_VISION: action('TOGGLE_ZONE_VISION'),
  TOGGLE_MARKERS: action('TOGGLE_MARKERS'),
  TOGGLE_TOPOGRAPHIC_OBJECTS: action('TOGGLE_TOPOGRAPHIC_OBJECTS'),
  GET_TOPOGRAPHIC_OBJECTS: action('GET_TOPOGRAPHIC_OBJECTS'),
  TOGGLE_TOPOGRAPHIC_OBJECTS_MODAL: action('TOGGLE_TOPOGRAPHIC_OBJECTS_MODAL'),
  SELECT_TOPOGRAPHIC_ITEM: action('SELECT_TOPOGRAPHIC_ITEM'),
  ADD_UNDO_RECORD: action('ADD_UNDO_RECORD'),
  UNDO: action('UNDO'),
  REDO: action('REDO'),
  TOGGLE_REPORT_MAP_MODAL: action('TOGGLE_REPORT_MAP_MODAL'),
  SAVE_COP_REPORT: action('SAVE_COP_REPORT'),
  TOGGLE_GEO_LANDMARK_MODAL: action('TOGGLE_GEO_LANDMARK_MODAL'),
  TOGGLE_DELETE_MARCH_POINT_MODAL: action('TOGGLE_DELETE_MARCH_POINT_MODAL'),
  HIGHLIGHT_OBJECT: action('HIGHLIGHT_OBJECT'),
}

export const changeTypes = {
  UPDATE_OBJECT: '(1) Update entire object', // TODO: FlexGrid implementation
  UPDATE_GEOMETRY: '(2) Update object geometry only',
  UPDATE_ATTRIBUTES: '(3) Update object attributes only', // TODO: used only in FlexGrid
  UPDATE_PARTIALLY: '(4) Update object attributes and geometry only', // TODO: used only in FlexGrid
  INSERT_OBJECT: '(5) Add new object',
  DELETE_OBJECT: '(6) Delete existing object',
  DELETE_LIST: '(7) Delete list of objects',
  LAYER_COLOR: '(8) Set Layer highlight color',
  CREATE_CONTOUR: '(9) Create contour',
  DELETE_CONTOUR: '(10) Delete contour',
  COPY_CONTOUR: '(11) Copy contour',
  MOVE_CONTOUR: '(12) Move contour',
  MOVE_LIST: '(13) Move list of objects',
  CREATE_GROUP: '(14) Create group',
  DROP_GROUP: '(15) Drop group',
  COPY_LIST: '(18) Copy list of objects',
}

export const setCoordinatesType = (value) => {
  settings.defaultType = value
  return {
    type: actionNames.SET_COORDINATES_TYPE,
    payload: value,
  }
}

export const setMapMode = (payload) => ({
  type: actionNames.SET_MAP_MODE,
  payload,
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

// @TODO: check is this idea working for us
// (if 3DMap is opened - then for counting use volumeMapZoom instead of using flatMap zoom)
export const setSubordinationLevelByZoom = (byZoom = null) => (dispatch, getState) => {
  const { params, webMap3D: { zoom: volumeZoom },
    webMap: { subordinationAuto, subordinationLevel, zoom },
    viewModes: { [viewModesKeys.map3D]: is3DMapMode } } = getState()
  if (subordinationAuto) {
    if (byZoom === null) {
      byZoom = !is3DMapMode ? zoom : volumeZoom
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

export const fixServerObject = ({ unit = null, type = null, ...rest }) => ({
  ...rest,
  unit: unit !== null ? Number(unit) : null,
  type: type !== null ? Number(type) : null,
})

export const addObject = (object, addUndoRecord = true) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { objInsert } }) => {
    validateObject(object)

    let payload = await objInsert(object)
    payload = fixServerObject(payload)

    if (addUndoRecord) {
      dispatch({
        type: actionNames.ADD_UNDO_RECORD,
        payload: {
          changeType: changeTypes.INSERT_OBJECT,
          id: payload.id,
        },
      })
    }

    dispatch({
      type: actionNames.ADD_OBJECT,
      payload,
    })

    return payload.id
  })

export const copyContour = (id, layer, shift, addUndoRecord = true) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { contourCopy } }) => {
    const payload = fixServerObject(await contourCopy(id, layer, shift))

    if (addUndoRecord) {
      dispatch({
        type: actionNames.ADD_UNDO_RECORD,
        payload: {
          changeType: changeTypes.COPY_CONTOUR,
          id: payload.id,
        },
      })
    }

    return dispatch({
      type: actionNames.ADD_OBJECT,
      payload,
    })
  })

export const getHeight = ({ lng: x, lat: y }) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { getHeight } }) => getHeight(x, y))

export const copyGroup = (id, layer, shift) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { groupCopy } }) => dispatch({
    type: actionNames.ADD_OBJECT,
    payload: fixServerObject(await groupCopy(id, layer, shift)),
  }))

export const moveContour = (id, shift, addUndoRecord = true) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { contourMove } }) => {
    const payload = fixServerObject(await contourMove(id, shift))

    if (addUndoRecord) {
      dispatch({
        type: actionNames.ADD_UNDO_RECORD,
        payload: {
          changeType: changeTypes.MOVE_CONTOUR,
          id,
          shift,
        },
      })
    }

    return dispatch({
      type: actionNames.ADD_OBJECT,
      payload,
    })
  })

export const moveObjList = (ids, shift, addUndoRecord = true) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { objListMove } }) => {
    await objListMove(ids, shift)

    if (addUndoRecord) {
      dispatch({
        type: actionNames.ADD_UNDO_RECORD,
        payload: {
          changeType: changeTypes.MOVE_LIST,
          list: ids,
          shift,
        },
      })
    }
  })

export const moveGroup = (id, shift) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { groupMove } }) => dispatch({
    type: actionNames.ADD_OBJECT,
    payload: fixServerObject(await groupMove(id, shift)),
  }))

const deleteContour = (layer, contour) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi }) =>
    dispatch(batchActions([
      tryUnlockObject(contour),
      selection.selectedList(await webmapApi.contourDelete(layer, contour)),
    ])),
  )

const restoreContour = (layer, contour, objects) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi }) => {
    await webmapApi.contourRestore(layer, contour, objects)
    return dispatch(selection.selectedList([ contour ]))
  })

const deleteGroup = (layer, group) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi }) =>
    dispatch(batchActions([
      tryUnlockObject(group),
      selection.selectedList(await webmapApi.groupDrop(group, layer)),
    ])),
  )

const restoreGroup = (layer, group, objects) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi }) => {
    await webmapApi.groupRestore(layer, group, objects)
    return dispatch(selection.selectedList([ group ]))
  })

const restoreObject = (id) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { objRestore } }) => {
    const payload = fixServerObject(await objRestore(id))

    return dispatch({
      type: actionNames.ADD_OBJECT,
      payload,
    })
  })

export const deleteObject = (id, addUndoRecord = true) =>
  asyncAction.withNotification(async (dispatch, getState, { webmapApi: { objDelete } }) => {
    await objDelete(id)

    if (addUndoRecord) {
      dispatch({
        type: actionNames.ADD_UNDO_RECORD,
        payload: {
          changeType: changeTypes.DELETE_OBJECT,
          id,
        },
      })
    }

    const flexGridId = getState().flexGrid.get('id')

    return id === flexGridId
      ? dispatch(flexGrid.flexGridDeleted)
      : dispatch({
        type: actionNames.DEL_OBJECT,
        payload: id,
      })
  })

export const deleteObjects = (list, addUndoRecord = true) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { objDeleteList } }) => {
    list = await objDeleteList(list)

    if (addUndoRecord) {
      dispatch({
        type: actionNames.ADD_UNDO_RECORD,
        payload: {
          changeType: changeTypes.DELETE_LIST,
          list,
        },
      })
    }

    dispatch({
      type: actionNames.DEL_OBJECTS,
      payload: list,
    })
  })

export const removeObjects = (ids) => (dispatch) => {
  dispatch(changeLog.logDeleteList(ids))
  dispatch({
    type: actionNames.DEL_OBJECTS,
    payload: ids,
  })
}

const restoreObjects = (ids) =>
  asyncAction.withNotification((dispatch, _, { webmapApi: { objRestoreList } }) => objRestoreList(ids))

export const getObjectAccess = (id, isMapCOP = true) => async (dispatch, _, { webmapApi: { objAccess } }) => {
  const result = await objAccess(id)
  if (result.access !== access.WRITE) {
    dispatch(notifications.push({
      type: 'warning',
      message: i18n.ERROR_ACCESS_DENIED,
      description: isMapCOP
        ? i18n.ERROR_ACCESS_DENIED_TO_OBJECT
        : i18n.ERROR_ACCESS_DENIED,
    }))
  }
  return result.access
}

export const refreshObjectList = (list, layer) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { objRefreshList } }) => {
    const { toUpdate, toDelete } = await objRefreshList(list, layer)
    dispatch({
      type: actionNames.OBJECT_LIST_REFRESH,
      payload: {
        toUpdate: toUpdate.map(fixServerObject),
        toDelete,
      },
    })
    if (toDelete.length) {
      dispatch(changeLog.logDeleteList(toDelete))
    }
    if (toUpdate.length) {
      dispatch(changeLog.logRefreshList(toUpdate.map(({ id }) => id)))
    }
  })

export const refreshObjects = (ids) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { objRefresh } }) => {
    for (const id of ids) {
      const object = fixServerObject(await objRefresh(id))
      await dispatch({
        type: actionNames.REFRESH_OBJECT,
        payload: { id, object },
      })
    }
    dispatch(changeLog.logRefreshList(ids))
  })

export const refreshObject = (id, type, layer) =>
  asyncAction.withNotification(async (dispatch, getState, { webmapApi: { objRefreshFull } }) => {
    const state = getState()
    const {
      layers: { byId },
      flexGrid: { flexGrid: currentGrid },
    } = state

    if (currentGrid && currentGrid.id === id) {
      const mapId = activeMapSelector(state)
      mapId && await dispatch(flexGrid.getFlexGrid(mapId))
      return
    }

    if (!byId.hasOwnProperty(layer)) {
      return // Об'єкт не належить жодному з відкритих шарів
    }

    const object = await objRefreshFull(id)
    if (!object) {
      return
    }

    if (Number(type) === entityKind.FLEXGRID) {
      return dispatch({
        type: flexGrid.GET_FLEXGRID,
        payload: object,
      })
    } else {
      dispatch(changeLog.logChange(object))
      if (object.deleted) {
        return dispatch({
          type: actionNames.DEL_OBJECT,
          payload: id,
        })
      } else {
        return dispatch({
          type: actionNames.REFRESH_OBJECT,
          payload: { id, object: fixServerObject(object) },
        })
      }
    }
  })

export const copyList = (fromLayer, toLayer, list, addUndoRecord = true) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { copyList } }) => {
    const ids = await copyList(fromLayer, toLayer, list)

    if (addUndoRecord) {
      dispatch({
        type: actionNames.ADD_UNDO_RECORD,
        payload: {
          changeType: changeTypes.COPY_LIST,
          list: ids,
        },
      })
    }

    return dispatch(selection.selectedList(ids))
  })

export const updateObject = ({ id, ...object }, addUndoRecord = true) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { objUpdate } }) => {
    stopHeartBeat()
    validateObject(object)

    const payload = fixServerObject(await objUpdate(id, object))

    if (addUndoRecord) {
      dispatch({
        type: actionNames.ADD_UNDO_RECORD,
        payload: {
          changeType: changeTypes.UPDATE_OBJECT,
          id,
          object,
        },
      })
    }

    dispatch({
      type: actionNames.UPD_OBJECT,
      payload,
    })
  })

export const updateObjectsByLayerId = (layerId) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { objGetList } }) => dispatch({
    type: actionNames.OBJECT_LIST,
    payload: {
      layerId,
      objects: (await objGetList(layerId)).map(fixServerObject),
    },
  }))

export const updateUnitObjectWithIndicators = (payload) => ({
  type: actionNames.RETURN_UNIT_INDICATORS,
  payload: payload,
})

export const allocateObjectsByLayerId = (layerId) => ({
  type: actionNames.ALLOCATE_OBJECTS_BY_LAYER_ID,
  payload: layerId,
})

export const updateObjectGeometry = (id, geometry, addUndoRecord = true, flexGridPrevState) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { objUpdateGeometry, objUpdateAttr } }) => {
    stopHeartBeat()

    const payloadGeometryUpdate = fixServerObject(await objUpdateGeometry(id, geometry))

    const attributes = payloadGeometryUpdate?.attributes || {}
    attributes[amps.dtg] = moment()
    const payload = fixServerObject(await objUpdateAttr(id, attributes))

    if (addUndoRecord) {
      dispatch({
        type: actionNames.ADD_UNDO_RECORD,
        payload: {
          changeType: changeTypes.UPDATE_GEOMETRY,
          id,
          geometry,
          flexGridPrevState,
        },
      })
    }

    return dispatch({
      type: actionNames.UPD_OBJECT,
      payload,
    })
  })

export const updateObjectAttributes = (id, attributes) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { objUpdateAttr } }) => {
    let payload = await objUpdateAttr(id, useArraysIn(attributes))

    payload = fixServerObject(payload)

    return dispatch({
      type: actionNames.UPD_OBJECT,
      payload,
    })
  })

export const updateObjPartially = (id, attributes, geometry = {}) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { objUpdatePartially } }) => {
    await window.webMap.onSelectedListChange([])
    let payload = await objUpdatePartially(id, { attributes, ...geometry })
    payload = fixServerObject(payload)
    return dispatch({
      type: actionNames.UPD_OBJECT,
      payload,
    })
  })

export const getAppInfo = () =>
  asyncAction.withNotification(
    async (dispatch, _, { webmapApi: { getVersion, getContactId }, milOrgApi }) => {
      const [
        version,
        { contactId, positionContactId, unitId, countryId, formationId, contactFullName },
      ] = await Promise.all([
        getVersion(),
        getContactId(),
      ])
      const unitsById = await reloadUnits(dispatch, milOrgApi, formationId)
      const defOrgStructure = await getFormationInfo(formationId, unitsById, milOrgApi, dispatch)

      return dispatch({
        type: actionNames.APP_INFO,
        payload: {
          version, contactId, positionContactId, unitId, countryId, formationId, defOrgStructure, contactFullName,
        },
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
    const { webMap: { lockedObjects, contactFullName } } = getState()
    let lockedBy = lockedObjects.get(objectId)
    let success = false
    if (lockedBy && (lockedBy !== contactFullName)) { // Игнорируем блокировку от себя
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
          stopHeartBeat()
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

export const toggleZoneProfile = () => ({
  type: actionNames.TOGGLE_ZONE_PROFILE,
})

export const toggleZoneVision = () => ({
  type: actionNames.TOGGLE_ZONE_VISION,
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
    return dispatch({
      type: actionNames.GET_TOPOGRAPHIC_OBJECTS,
      payload: topographicObject,
    })
  })

export const toggleReportMapModal = (visible, dataMap = null) => ({
  type: actionNames.TOGGLE_REPORT_MAP_MODAL,
  payload: {
    visible,
    dataMap,
  },
})

export const saveCopReport = (mapName, fromMapId, dateOn) =>
  asyncAction.withNotification((dispatch, _, { webmapApi: { createCOPReport } }) =>
    createCOPReport(mapName, fromMapId, dateOn))

async function performAction (record, direction, api, dispatch) {
  const { changeType, id, list, layer, oldData, newData } = record
  const undo = direction === 'undo'
  const data = undo ? oldData : newData
  switch (changeType) {
    case changeTypes.UPDATE_OBJECT:
      return dispatch(updateObject({ id, ...data }, false))
    case changeTypes.UPDATE_GEOMETRY:
      return dispatch(updateObjectGeometry(id, data, false))
    case changeTypes.INSERT_OBJECT:
    case changeTypes.COPY_CONTOUR:
      return dispatch(undo ? deleteObject(id, false) : restoreObject(id))
    case changeTypes.DELETE_OBJECT:
      return dispatch(undo ? restoreObject(id) : deleteObject(id, false))
    case changeTypes.DELETE_LIST:
      return dispatch(undo ? restoreObjects(list) : deleteObjects(list, false))
    case changeTypes.COPY_LIST:
      return dispatch(undo ? deleteObjects(list, false) : restoreObjects(list))
    case changeTypes.LAYER_COLOR: {
      await api.layerSetColor(id, data)
      return dispatch({
        type: layers.UPDATE_LAYER,
        layerData: {
          laterId: id,
          color: data,
        },
      })
    }
    case changeTypes.CREATE_CONTOUR:
      return dispatch(undo ? deleteContour(layer, id) : restoreContour(layer, id, list))
    case changeTypes.DELETE_CONTOUR:
      return dispatch(undo ? restoreContour(layer, id, list) : deleteContour(layer, id))
    case changeTypes.MOVE_CONTOUR:
      return dispatch(moveContour(id, data, false))
    case changeTypes.MOVE_LIST:
      return dispatch(moveObjList(list, data, false))
    case changeTypes.CREATE_GROUP:
      return dispatch(undo ? deleteGroup(layer, id) : restoreGroup(layer, id, list))
    case changeTypes.DROP_GROUP:
      return dispatch(undo ? restoreGroup(layer, id, list) : deleteGroup(layer, id))
    default:
      console.warn(`Unknown change type: ${changeType}`)
  }
}

export const undo = () =>
  asyncAction.withNotification(async (dispatch, getState, { webmapApi }) => {
    const state = getState()
    const undoRecord = state.webMap.undoRecords.get(state.webMap.undoPosition - 1)
    await performAction(undoRecord, 'undo', webmapApi, dispatch)
    return dispatch({
      type: actionNames.UNDO,
    })
  })

export const redo = () =>
  asyncAction.withNotification(async (dispatch, getState, { webmapApi }) => {
    const state = getState()
    const undoRecord = state.webMap.undoRecords.get(state.webMap.undoPosition)
    await performAction(undoRecord, 'redo', webmapApi, dispatch)
    return dispatch({
      type: actionNames.REDO,
    })
  })

export const toggleGeoLandmarkModal = (visible, coordinates, segmentId, childId) => ({
  type: actionNames.TOGGLE_GEO_LANDMARK_MODAL,
  payload: {
    visible,
    coordinates,
    segmentId,
    childId,
  },
})

export const toggleDeleteMarchPointModal = (visible, segmentId, childId) => ({
  type: actionNames.TOGGLE_DELETE_MARCH_POINT_MODAL,
  payload: {
    visible,
    segmentId,
    childId,
  },
})

// Ініціалізація
window.addEventListener('beforeunload', () => {
  dropLock && dropLock()
  stopHeartBeat()
})

export const highlightObject = (id) => ({
  type: actionNames.HIGHLIGHT_OBJECT,
  payload: id
    ? {
      list: Array.isArray(id) ? id : [ id ],
    }
    : null,
})
