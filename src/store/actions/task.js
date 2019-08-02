import { batchActions } from 'redux-batched-actions'
import { action } from '../../utils/services'
import { ApiError } from '../../constants/errors'
import i18n from '../../i18n'
import { isFriend, isEnemy } from '../../utils/affiliations'
import { withNotification } from './asyncAction'

export const SET_ENEMY_ID = action('TASK_SET_ENEMY_ID')
export const SET_FRIEND_ID = action('TASK_SET_FRIEND_ID')
export const SET_ADDITION_DATA = action('TASK_SET_ADDITION_DATA')
export const CHANGE_VALUE = action('TASK_SET_VALUE')

export const setAdditionData = (payload) => ({ type: SET_ADDITION_DATA, payload })
export const setEnemyObject = (payload) => ({ type: SET_ENEMY_ID, payload })
export const setFriendObject = (payload) => ({ type: SET_FRIEND_ID, payload })

export const changeValue = (payload) => ({ type: CHANGE_VALUE, payload })

export const addObject = (id) => (dispatch, getState) => {
  const { webMap: { objects }, task: { enemyObjectId, friendObjectId } } = getState()
  const object = objects.get(id)

  const actions = []
  if (isFriend(object.code)) {
    if (enemyObjectId) {
      actions.push(show({ friendObjectId: id, enemyObjectId }))
      actions.push(setEnemyObject(null))
    } else {
      actions.push(setFriendObject(id))
    }
  } else if (isEnemy(object.code)) {
    if (friendObjectId) {
      actions.push(show({ friendObjectId, enemyObjectId: id }))
      actions.push(setFriendObject(null))
    } else {
      actions.push(setEnemyObject(id))
    }
  }
  dispatch(batchActions(actions))
}

const getMilsymbolEl = ({ code, id }) =>
  `<a href="http://milsymbol/?code=${code}&id=${id}">знак</a>`
const getCoordinateEl = ({ lng, lat }) =>
  `<a href="http://coordinate/?lng=${lng}&lat=${lat}">текст2</a>`

export const show = ({ enemyObjectId, friendObjectId }) => withNotification(async (dispatch, getState) => {
  if (enemyObjectId !== null && friendObjectId !== null) {
    const { webMap: { objects, contactId } } = getState()
    const enemyObject = objects.find((object) => object && object.id === enemyObjectId)
    const friendObject = objects.find((object) => object && object.id === friendObjectId)

    const milSymbolEl = getMilsymbolEl(enemyObject)
    const coordinateEl = getCoordinateEl(enemyObject.point)
    await dispatch(changeValue({
      name: i18n.DESTROY,
      description: i18n.DESTROY_DESCRIPTION(milSymbolEl, coordinateEl),
      executor: [ { id_user: friendObject.unit } ],
      captain: [ { id_user: contactId } ],
      inspectors: [ { id_user: contactId } ],
    }))
    window.explorerBridge.getAdditionTaskData()
  }
})
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
  dispatch(changeValue(null))
})
export const close = () => withNotification(async (dispatch, getState) => {
  dispatch(changeValue(null))
})
