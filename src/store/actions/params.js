import { batchActions } from 'redux-batched-actions'
import { utils } from '@C4/CommonComponents'
import { action } from '../../utils/services'
import { ApiError } from '../../constants/errors'
import i18n from '../../i18n'
import * as paramNames from '../../constants/params'
import { asyncAction, layers, webMap } from './index'

const { Coordinates: Coord } = utils

export const actionNames = {
  LOAD_PARAMS: action('LOAD_PARAMS'),
  LOAD_PARAM: action('LOAD_PARAM'),
  SAVE_PARAM: action('SAVE_PARAM'),
}

export const loadAllParams = () =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi }) => {
    const payload = await webmapApi.paramGetAll()
    if (payload[paramNames.MAP_BASE_OPACITY] !== undefined) {
      payload[paramNames.MAP_BASE_OPACITY] = Number(payload[paramNames.MAP_BASE_OPACITY])
    }
    if (payload[paramNames.INACTIVE_LAYERS_OPACITY] !== undefined) {
      payload[paramNames.INACTIVE_LAYERS_OPACITY] = Number(payload[paramNames.INACTIVE_LAYERS_OPACITY])
    }
    if (payload[paramNames.MINI_MAP] === 'false') {
      payload[paramNames.MINI_MAP] = false
    }
    if (payload[paramNames.SHOW_AMPLIFIERS] === 'false') {
      payload[paramNames.SHOW_AMPLIFIERS] = false
    }
    if (payload[paramNames.GENERALIZATION] === 'false') {
      payload[paramNames.GENERALIZATION] = false
    }
    dispatch(batchActions([
      {
        type: actionNames.LOAD_PARAMS,
        payload,
      },
      layers.setBackOpacity(payload[paramNames.MAP_BASE_OPACITY]),
      layers.setHiddenOpacity(payload[paramNames.INACTIVE_LAYERS_OPACITY]),
      webMap.setCoordinatesType(payload[paramNames.DEFAULT_COORD_SYSTEM] || Coord.types.WGS_84),
      webMap.setMiniMap(payload[paramNames.MINI_MAP]),
      webMap.setAmplifiers(payload[paramNames.SHOW_AMPLIFIERS]),
      webMap.setGeneralization(payload[paramNames.GENERALIZATION]),
    ]))
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
