import { batchActions } from 'redux-batched-actions'
import { action } from '../../utils/services'
import { ApiError } from '../../constants/errors'
import i18n from '../../i18n'
import { isFriend, isEnemy } from '../../utils/affiliations'
import { withNotification } from './asyncAction'

export const SET_ENEMY_ID = action('TASK_SET_ENEMY_ID')
export const SET_FRIEND_ID = action('TASK_SET_FRIEND_ID')
export const SET_TASK_MODAL_DATA = action('SET_TASK_MODAL_DATA')

export const TaskTypes = {
  TARGET: 'target',
  REQUEST: 'request',
  OTHER: 'other',
}

export const setModalData = (payload) => ({ type: SET_TASK_MODAL_DATA, payload })
const setEnemyObject = (payload) => ({ type: SET_ENEMY_ID, payload })
const setFriendObject = (payload) => ({ type: SET_FRIEND_ID, payload })

export const addObject = (id) => (dispatch, getState) => {
  const { webMap: { objects }, task: { enemyObjectId, friendObjectId } } = getState()
  const object = objects.get(id)

  if (isFriend(object.code)) {
    dispatch(setFriendObject(id))
    enemyObjectId && showModalRequest({
      taskTypes: [ TaskTypes.TARGET ],
      targetObject: objects.get(enemyObjectId),
      executorObject: object,
    })
  } else if (isEnemy(object.code)) {
    dispatch(setEnemyObject(id))
    friendObjectId && showModalRequest({
      taskTypes: [ TaskTypes.TARGET ],
      targetObject: object,
      executorObject: objects.get(friendObjectId),
    })
  }
}

export const showTaskByObject = (id) => (dispatch, getState) => {
  const { webMap: { objects } } = getState()
  showModalRequest({ taskTypes: [ TaskTypes.REQUEST, TaskTypes.OTHER ], targetObject: objects.get(id) })
}
export const showTaskByCoordinate = (coordinate) => (dispatch, getState) => {
  showModalRequest({ taskTypes: [ TaskTypes.REQUEST, TaskTypes.OTHER ], coordinate })
}

const showModalRequest = ({ taskTypes = [], targetObject = null, executorObject = null, coordinate = null }) => {
  if (targetObject !== null || coordinate !== null) {
    window.explorerBridge.showTaskModalRequest({
      taskTypes,
      unitId: (executorObject && executorObject.unit) || null,
      object: targetObject ? { id: targetObject.id, code: targetObject.code } : null,
      coordinate: coordinate || targetObject.point || null,
    })
  }
}

export const showModalResponse = (modalData, errors) => (dispatch, getState) => {
  if (errors && errors.length) {
    throw new ApiError(errors)
  }
  dispatch(batchActions([
    setEnemyObject(null),
    setFriendObject(null),
    setModalData(modalData),
  ]))
}

export const save = (task) => withNotification(async (dispatch, getState) => {
  window.explorerBridge.saveTask(task)
})
export const saveResponse = (errors) => withNotification(async (dispatch, getState) => {
  if (errors && errors.length) {
    throw new ApiError(i18n.ERROR_SAVE_TASK)
  }
})
export const send = (task) => withNotification(async (dispatch, getState) => {
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
