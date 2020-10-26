import { elevationProfile } from '../actions'
const initialState = {
  elProfileData: {},
  zoneProfileData: {},
  showStraightLine: false,
  isModalOpen: false,
  visibleZone: null,
  visibleZoneSector: null,
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
      return { ...state, isModalOpen: payload, showStraightLine: false }
    }
    case elevationProfile.CREATE_ZONE_PROFILE: {
      const { payload } = action
      return { ...state, isModalOpen: true, zoneProfileData: payload }
    }
    case elevationProfile.SET_BLIND_ZONE_DATA: {
      const { payload } = action
      return { ...state, visibleZone: payload[1], visibleZoneSector: payload[0] }
    }
    default:
      return state
  }
}
