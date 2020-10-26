import { action } from '../../utils/services'
import { asyncAction } from './'

export const GET_ELEVATION_PROFILE = action('GET_ELEVATION_PROFILE')
export const CHANGE_STRAIGHT_LINE_STATE = action('CHANGE_STRAIGHT_LINE_STATE')
export const CHANGE_SHOW_MODAL_STATE = action('CHANGE_SHOW_MODAL_STATE')
export const CREATE_ZONE_PROFILE = action('CREATE_ZONE_PROFILE')
export const SET_BLIND_ZONE_DATA = action('SET_BLIND_ZONE_DATA')

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

export const getBlindZone = (data) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { getBlindZone } }) => {
    const blindZone = await getBlindZone(data)
    return dispatch({
      type: SET_BLIND_ZONE_DATA,
      payload: blindZone,
    })
  })

export const getZoneHeightProfile = (data, values) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { heightProfile } }) => {
    const zoneProfile = await heightProfile(data)
    return dispatch({
      type: CREATE_ZONE_PROFILE,
      payload: { ...zoneProfile, ...values },
    })
  })
