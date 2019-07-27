import { action } from '../../utils/services'
import { asyncAction } from './index'

export const SET_TARGETING_MODE = action('SET_TARGETING_MODE')
export const TOGGLE_TARGETING_MODE = action('TOGGLE_TARGETING_MODE')

export const setTargetingMode = (on) => ({
  type: SET_TARGETING_MODE,
  payload: on,
})

export const toggleTargetingMode = () => ({
  type: TOGGLE_TARGETING_MODE,
})

export const getZones = (objects) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { buildZone } }) => buildZone(objects))
