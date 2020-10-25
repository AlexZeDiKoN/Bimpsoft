import { action } from '../../utils/services'

export const GET_ELEVATION_PROFILE = action('GET_ELEVATION_PROFILE')
export const CHANGE_STRAIGHT_LINE_STATE = action('CHANGE_STRAIGHT_LINE_STATE')
export const CHANGE_SHOW_MODAL_STATE = action('CHANGE_SHOW_MODAL_STATE')
export const CREATE_ZONE_PROFILE = action('CREATE_ZONE_PROFILE')

export const setStraightLineState = (payload) => ({
  type: CHANGE_STRAIGHT_LINE_STATE,
  payload,
})

export const setShowModalState = (payload) => ({
  type: CHANGE_SHOW_MODAL_STATE,
  payload,
})

export const createZoneProfile = (payload) => ({
  type: CREATE_ZONE_PROFILE,
  payload,
})
