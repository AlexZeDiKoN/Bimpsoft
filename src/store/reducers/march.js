import { List } from 'immutable'
import { march } from '../actions'
import { uuid } from '../../components/WebMap/patch/Sophisticated/utils'

import i18n from './../../i18n'

const initState = {
  marchEdit: false,
  indicators: undefined,
  integrity: false,
  coordMode: false,
  coordModeData: { },
  geoLandmarks: {},
  isCoordFilled: false,
  time: 0,
  distance: 0,
  coordRefPoint: null,
  pointsTypes: [
    { id: 0, name: i18n.POINT_ON_MARCH },
    { id: 1, name: i18n.REST_POINT },
    { id: 2, name: i18n.DAY_NIGHT_REST_POINT },
    { id: 3, name: i18n.DAILY_REST_POINT },
    { id: 4, name: i18n.LINE_OF_REGULATION },
  ],
  payload: null,
  segments: List([]),
  existingSegmentsById: {},
  landmarks: [],
}

export default function reducer (state = initState, action) {
  const { type, payload } = action

  switch (type) {
    case march.GET_TYPE_KINDS: {
      const indicators = payload.reduce(
        (prev, current) => ({ ...prev, [current.typeCode]: current }), {})
      return { ...state, indicators }
    }
    case march.SET_MARCH_PARAMS: {
      const { marchType, template } = payload
      if (marchType) {
        const segments = template.map((item) => ({ ...item, id: uuid() }))
        const params = { ...state.params, ...{ marchType, segments } }
        return { ...state, params }
      } else {
        const params = { ...state.params, ...payload }
        return { ...state, params }
      }
    }
    case march.SET_INTEGRITY: {
      return { ...state, integrity: payload }
    }
    case march.EDIT_FORM_FIELD:
    case march.ADD_SEGMENT:
    case march.DELETE_SEGMENT:
    case march.ADD_CHILD:
    case march.DELETE_CHILD:
    case march.SET_COORD_FROM_MAP:
    case march.INIT_MARCH:
      return { ...state, ...payload }
    case march.SET_COORD_MODE: {
      return { ...state, coordMode: !state.coordMode, coordModeData: payload }
    }
    case march.SET_REF_POINT_ON_MAP: {
      return { ...state, coordRefPoint: payload }
    }
    case march.CLOSE_MARCH: {
      return { ...state, marchEdit: false, segments: List([]) }
    }
    case march.SET_GEO_LANDMARKS: {
      return { ...state, geoLandmarks: payload }
    }
    default:
      return state
  }
}
