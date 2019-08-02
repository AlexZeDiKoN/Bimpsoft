import { action } from '../../utils/services'
import { ApiError } from '../../constants/errors'
import i18n from '../../i18n'
import { withNotification } from './asyncAction'

export const SHOW = action('TASK_SHOW')
export const HIDE = action('TASK_HIDE')
export const SET_ADDITION_DATA = action('TASK_SET_ADDITION_DATA')
export const CHANGE_VALUE = action('TASK_SET_VALUE')

export const setAdditionData = (payload) => ({ type: SET_ADDITION_DATA, payload })

export const changeValue = (payload) => ({ type: CHANGE_VALUE, payload })

export const show = () => withNotification(async (dispatch, getState) => {
  dispatch(changeValue({}))
  window.explorerBridge.getAdditionTaskData()
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
