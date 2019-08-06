import { batchActions } from 'redux-batched-actions'
import { action } from '../../utils/services'
import { ApiError } from '../../constants/errors'
import i18n from '../../i18n'
import { isFriend, isEnemy } from '../../utils/affiliations'
import { activeMapSelector } from '../selectors'
import * as notifications from './notifications'
import { withNotification } from './asyncAction'

export const SET_ENEMY_ID = action('TASK_SET_ENEMY_ID')
export const SET_FRIEND_ID = action('TASK_SET_FRIEND_ID')
export const SET_TASK_MODAL_DATA = action('SET_TASK_MODAL_DATA')
export const SET_TASK_VALUE = action('SET_TASK_VALUE')

export const TaskTypes = {
  TARGET: 'target',
  REQUEST: 'request',
  OTHER: 'other',
}

export const setModalData = (payload) => ({ type: SET_TASK_MODAL_DATA, payload })
export const setValue = (payload) => ({ type: SET_TASK_VALUE, payload })
export const setEnemyObject = (payload) => ({ type: SET_ENEMY_ID, payload })
export const setFriendObject = (payload) => ({ type: SET_FRIEND_ID, payload })

export const addObject = (id) => withNotification(async (dispatch, getState) => {
  const state = getState()
  const { webMap: { objects }, task: { enemyObjectId, friendObjectId } } = state
  const object = objects.get(id)

  if (object && isFriend(object.code)) {
    await dispatch(setFriendObject(id))
    enemyObjectId && await showModalRequest({
      mapId: activeMapSelector(state),
      taskTypes: [ TaskTypes.TARGET ],
      targetObject: objects.get(enemyObjectId),
      executorObject: object,
    })
  } else if (object && isEnemy(object.code)) {
    await dispatch(setEnemyObject(id))
    friendObjectId && await showModalRequest({
      mapId: activeMapSelector(state),
      taskTypes: [ TaskTypes.TARGET ],
      targetObject: object,
      executorObject: objects.get(friendObjectId),
    })
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

const showModalRequest = ({ mapId, taskTypes = [], targetObject = null, executorObject = null, coordinate = null }) => {
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
    })
  }
}

export const showModalResponse = (modalData, errors) => withNotification((dispatch, getState) => {
  if (errors && errors.length) {
    throw new ApiError(errors, i18n.CREATE_TASK_ERROR, true)
  }
  dispatch(batchActions([
    setEnemyObject(null),
    setFriendObject(null),
    setModalData(modalData),
  ]))
})

const messageToText = (message) => (message && message.message) ? message.message : String(message)

export const save = (task) => withNotification(async (dispatch, getState) => {
  await dispatch(setValue(task))
  window.explorerBridge.saveTask(task)
})
export const saveResponse = (errors, id) => withNotification(async (dispatch, getState) => {
  if (errors && errors.length) {
    throw new ApiError(errors.map(messageToText).join(), i18n.ERROR_SAVE_TASK)
  }
  await dispatch(setValue({ id }))
  await dispatch(notifications.push({
    type: 'success',
    message: i18n.TASK_SENT,
    description: i18n.TASK_SAVED,
  }))
})
export const send = (task) => withNotification(async (dispatch, getState) => {
  await dispatch(setValue(task))
  window.explorerBridge.sendTask(task)
})
export const sendResponse = (errors) => withNotification(async (dispatch, getState) => {
  if (errors && errors.length) {
    throw new ApiError(errors.map(messageToText).join(), i18n.ERROR_SEND_TASK)
  }
  await dispatch(notifications.push({
    type: 'success',
    message: i18n.CREATE_TASK,
    description: i18n.TASK_SENT,
  }))
  dispatch(setModalData(null))
})
export const close = () => withNotification(async (dispatch, getState) => {
  dispatch(setModalData(null))
})
