import { action } from '../../utils/services'
import { ApiError } from '../../constants/errors'
import i18n from '../../i18n'
import { asyncAction } from './index'

export const actionNames = {
  LOAD_PARAMS: action('LOAD_PARAMS'),
  LOAD_PARAM: action('LOAD_PARAM'),
  SAVE_PARAM: action('SAVE_PARAM'),
}

export const loadAllParams = () =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi }) => {
    const payload = await webmapApi.paramGetAll()
    dispatch({
      type: actionNames.LOAD_PARAMS,
      payload,
    })
  })

export const loadParam = (name) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi }) => {
    const param = await webmapApi.paramGet(name)
    const value = param ? param.value : null
    dispatch({
      type: actionNames.LOAD_PARAM,
      payload: { name, value },
    })
  })

export const saveParam = (name, value) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi }) => {
    dispatch({
      type: actionNames.LOAD_PARAM,
      payload: { name, value },
    })
    try {
      await webmapApi.paramSet(name, value)
    } catch (e) {
      throw new ApiError(i18n.ERROR_WHEN_SAVE_PARAMETER, i18n.SERVER_WARNING, true)
    }
  })
