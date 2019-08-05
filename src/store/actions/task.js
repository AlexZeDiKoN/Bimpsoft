import { batchActions } from 'redux-batched-actions'
import { action } from '../../utils/services'
import { ApiError } from '../../constants/errors'
import i18n from '../../i18n'
import { isFriend, isEnemy } from '../../utils/affiliations'
import { activeMapSelector } from '../selectors'
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
const setEnemyObject = (payload) => ({ type: SET_ENEMY_ID, payload })
const setFriendObject = (payload) => ({ type: SET_FRIEND_ID, payload })

export const addObject = (id) => (dispatch, getState) => {
  const state = getState()
  const { webMap: { objects }, task: { enemyObjectId, friendObjectId } } = state
  const object = objects.get(id)

  if (isFriend(object.code)) {
    dispatch(setFriendObject(id))
    enemyObjectId && showModalRequest({
      mapId: activeMapSelector(state),
      taskTypes: [ TaskTypes.TARGET ],
      targetObject: objects.get(enemyObjectId),
      executorObject: object,
    })
  } else if (isEnemy(object.code)) {
    dispatch(setEnemyObject(id))
    friendObjectId && showModalRequest({
      mapId: activeMapSelector(state),
      taskTypes: [ TaskTypes.TARGET ],
      targetObject: object,
      executorObject: objects.get(friendObjectId),
    })
  }
}

export const showTaskByObject = (id) => (dispatch, getState) => {
  const state = getState()
  const { webMap: { objects } } = state
  showModalRequest({
    mapId: activeMapSelector(state),
    taskTypes: [ TaskTypes.REQUEST, TaskTypes.OTHER ],
    targetObject: objects.get(id),
  })
}
export const showTaskByCoordinate = (coordinate) => (dispatch, getState) => {
  const state = getState()
  showModalRequest({
    mapId: activeMapSelector(state),
    taskTypes: [ TaskTypes.REQUEST, TaskTypes.OTHER ],
    coordinate,
  })
}

const showModalRequest = ({ mapId, taskTypes = [], targetObject = null, executorObject = null, coordinate = null }) => {
  if (targetObject !== null || coordinate !== null) {
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
    throw new ApiError(errors)
  }
  dispatch(batchActions([
    setEnemyObject(null),
    setFriendObject(null),
    setModalData(modalData),
  ]))
})

export const save = (task) => withNotification(async (dispatch, getState) => {
  await dispatch(setValue(task))
  window.explorerBridge.saveTask(task)
})
export const saveResponse = (errors, id) => withNotification(async (dispatch, getState) => {
  if (errors && errors.length) {
    throw new ApiError(i18n.ERROR_SAVE_TASK)
  }
  dispatch(setValue({ id }))
})
export const send = (task) => withNotification(async (dispatch, getState) => {
  await dispatch(setValue(task))
  window.explorerBridge.sendTask(task)
})
export const sendResponse = (errors) => withNotification(async (dispatch, getState) => {
  if (errors && errors.length) {
    throw new ApiError(i18n.ERROR_SAVE_TASK)
  }
  dispatch(setModalData(null))
})
export const close = () => withNotification(async (dispatch, getState) => {
  dispatch(setModalData(null))
})
