import { action } from '../../utils/services'

export const SET_TARGETING_MODE = action('SET_TARGETING_MODE')
export const TOGGLE_TARGETING_MODE = action('TOGGLE_TARGETING_MODE')

export const setTargetingMode = (on) => ({
  type: SET_TARGETING_MODE,
  payload: on,
})

export const toggleTargetingMode = () => ({
  type: TOGGLE_TARGETING_MODE,
})
