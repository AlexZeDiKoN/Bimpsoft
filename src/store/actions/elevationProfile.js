import { action } from '../../utils/services'
import { asyncAction } from './index'

export const CLEAR_STATE = action('CLEAR_STATE')
export const GET_ELEVATION_PROFILE = action('GET_ELEVATION_PROFILE')
export const CHANGE_STRAIGHT_LINE_STATE = action('CHANGE_STRAIGHT_LINE_STATE')
export const CHANGE_SHOW_MODAL_STATE = action('CHANGE_SHOW_MODAL_STATE')

export const clearElevationProfile = () => ({
  type: CLEAR_STATE,
})

const setElevationProfile = (payload) => ({
  type: GET_ELEVATION_PROFILE,
  payload,
})

export const setStraightLineState = (payload) => ({
  type: CHANGE_STRAIGHT_LINE_STATE,
  payload,
})

export const setShowModalState = (payload) => ({
  type: CHANGE_SHOW_MODAL_STATE,
  payload,
})

export const getElevationProfile = () => asyncAction.withNotification(async (dispatch, _, { elevationProfileApi }) => {
  const mock = {"x1": "32", "y1": "50", "x2": "31", "y2": "50", "parts": 50}
  return dispatch(setElevationProfile(await elevationProfileApi.getElevationProfile(mock)))
})
