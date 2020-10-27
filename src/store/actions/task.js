import { batchActions } from 'redux-batched-actions'
import { action } from '../../utils/services'
import { ApiError } from '../../constants/errors'
import i18n from '../../i18n'
import { isFriendObject, isEnemyObject } from '../../utils/affiliations'
import { activeMapSelector, currentMapTargetLayers } from '../selectors'
import SelectionTypes from '../../constants/SelectionTypes'
import * as notifications from './notifications'
import { withNotification } from './asyncAction'
import { webMap } from './index'

export const SET_FRIEND_ID = action('TASK_SET_FRIEND_ID')
export const SET_TASK_MODAL_DATA = action('SET_TASK_MODAL_DATA')
export const SET_ZONE_VISION_MODAL_DATA = action('SET_ZONE_VISION_MODAL_DATA')
export const SET_TASK_VALUE = action('SET_TASK_VALUE')
export const SET_TASK_CONTEXT_VALUE = action('SET_TASK_CONTEXT_VALUE')

export const TaskTypes = {
  TARGET: 'target',
  REQUEST: 'request',
  OTHER: 'other',
}

export const setModalData = (modalData, context) => ({
  type: SET_TASK_MODAL_DATA,
  payload: { modalData, context },
})

export const setValue = (payload) => ({ type: SET_TASK_VALUE, payload })
export const setContextValue = (payload) => ({ type: SET_TASK_CONTEXT_VALUE, payload })
export const setFriendObject = (payload) => ({ type: SET_FRIEND_ID, payload })
export const DESTROY_COMMAND_SIGN = '10032500003409000000'

const getDestroyObject = (sourceObject, layer) => ({
  type: SelectionTypes.POINT,
  code: DESTROY_COMMAND_SIGN,
  point: sourceObject.point,
  geometry: sourceObject.geometry,
  unit: null,
  level: sourceObject.level,
  affiliation: null,
  layer: layer,
  parent: sourceObject.id,
  attributes: {},
  hash: null,
  indicatorsData: undefined,
})

export const addObject = (id) => withNotification(async (dispatch, getState) => {
  const state = getState()
  const { webMap: { objects }, task: { friendObjectId } } = state

  const object = objects.get(id)

  if (object && isFriendObject(object)) {
    await dispatch(setFriendObject(id))
  } else if (object && isEnemyObject(object)) {
    if (friendObjectId) {
      const [ firstTargetLayer ] = currentMapTargetLayers(state)
      await showModalRequest({
        newObject: getDestroyObject(object, firstTargetLayer),
        mapId: activeMapSelector(state),
        taskTypes: [ TaskTypes.TARGET ],
        targetObject: object,
        executorObject: objects.get(friendObjectId),
      })
    }
  }
})

export const showTaskByObject = (id) => withNotification(async (dispatch, getState) => {
  const state = getState()
  const { webMap: { objects } } = state
  showModalRequest({
    mapId: activeMapSelector(state),
    taskTypes: [ TaskTypes.REQUEST, TaskTypes.OTHER ],
    targetObject: objects.get(id),
  })
})
export const showTaskByCoordinate = (coordinate) => withNotification(async (dispatch, getState) => {
  const state = getState()
  showModalRequest({
    mapId: activeMapSelector(state),
    taskTypes: [ TaskTypes.REQUEST, TaskTypes.OTHER ],
    coordinate,
  })
})

const showModalRequest = (options) => {
  const {
    newObject = null,
    mapId,
    taskTypes = [],
    targetObject = null,
    executorObject = null,
    coordinate = null,
  } = options
  if (targetObject !== null || coordinate !== null) {
    if (executorObject !== null && !executorObject.unit) {
      throw new ApiError(i18n.CREATE_TASK_ERROR_UNIT_NOT_DEFINED, i18n.CREATE_TASK_ERROR, true)
    }
    const object = targetObject
      ? { map: mapId, id: targetObject.id, code: targetObject.code, layer: targetObject.layer }
      : null
    window.explorerBridge.showTaskModalRequest({
      mapId,
      taskTypes,
      unitId: (executorObject && executorObject.unit) || null,
      object,
      coordinate: coordinate || (targetObject && ({
        lng: targetObject.point.lng,
        lat: targetObject.point.lat,
        map: mapId,
      })) || null,
    }, { newObject })
  }
}

export const showModalResponse = (modalData, context, errors) => withNotification((dispatch, getState) => {
  if (errors && errors.length) {
    throw new ApiError(errors, i18n.CREATE_TASK_ERROR, true)
  }
  dispatch(batchActions([
    setFriendObject(null),
    setModalData(modalData, context),
  ]))
})

const messageToText = (message) => (message && message.message) ? message.message : String(message)

export const save = (task) => withNotification(async (dispatch, getState) => {
  const { task: { context } } = getState()
  await dispatch(setValue(task))

  window.explorerBridge.saveTask(task, context)
})
export const saveResponse = (errors, id, context) => withNotification(async (dispatch, getState) => {
  if (errors && errors.length) {
    throw new ApiError(errors.map(messageToText).join(), i18n.ERROR_SAVE_TASK)
  }
  await dispatch(setValue({ id }))
  await dispatch(notifications.push({
    type: 'success',
    message: i18n.TASK_SAVED,
    description: i18n.TASK_SAVED,
  }))
  if (context && context.newObject) {
    await dispatch(webMap.addObject({
      ...context.newObject,
      attributes: {
        ...(context.newObject.attributes || {}),
        taskId: id,
      },
    }))
    await dispatch(setContextValue({ newObject: null }))
  }
})
export const send = (task) => withNotification(async (dispatch, getState) => {
  const { task: { context } } = getState()
  await dispatch(setValue(task))
  window.explorerBridge.sendTask(task, context)
})
export const sendResponse = (errors, id, context) => withNotification(async (dispatch, getState) => {
  if (errors && errors.length) {
    throw new ApiError(errors.map(messageToText).join(), i18n.ERROR_SEND_TASK)
  }
  await dispatch(notifications.push({
    type: 'success',
    message: i18n.TASK_SENT,
    description: i18n.TASK_SENT_TO_EXECUTOR,
  }))
  await dispatch(setModalData(null, null))
  if (context && context.newObject) {
    dispatch(webMap.addObject({
      ...context.newObject,
      attributes: {
        ...(context.newObject.attributes || {}),
        taskId: id,
      },
    }))
  }
})

export const close = () => withNotification(async (dispatch, getState) => {
  dispatch(setModalData(null, null))
})
