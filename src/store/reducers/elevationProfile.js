/**
 * Created by pavlo.cherevko (melight@ex.ua) on 7/15/2019
 */
import { elevationProfile } from '../actions'
const initialState = {
  elProfileData: {},
  zoneProfileData: {},
  showStraightLine: false,
  isModalOpen: false,
}

export default function (state = initialState, action) {
  const { type } = action
  switch (type) {
    case elevationProfile.GET_ELEVATION_PROFILE: {
      const { payload } = action
      return { ...state, elProfileData: payload }
    }
    case elevationProfile.CHANGE_STRAIGHT_LINE_STATE: {
      const { payload } = action
      return { ...state, showStraightLine: payload }
    }
    case elevationProfile.CHANGE_SHOW_MODAL_STATE: {
      const { payload } = action
      return { ...state, isModalOpen: payload }
    }
    case elevationProfile.CREATE_ZONE_PROFILE: {
      const { payload } = action
      return { ...state, isModalOpen: true, zoneProfileData: payload }
    }
    case elevationProfile.CLEAR_STATE: {
      return { ...initialState }
    }
    default:
      return state
  }
}
