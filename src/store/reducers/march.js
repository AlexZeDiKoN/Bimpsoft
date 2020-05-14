import { List } from 'immutable'
import { march } from '../actions'
import utilsMarch from '../../components/common/March/utilsMarch'

const { uuid } = utilsMarch.reducersHelpers

const initState = {
  marchEdit: true,
  indicators: undefined,
  integrity: false,
  coordMode: false,
  coordModeData: { },
  time: 0,
  distance: 0,
  coordRefPoint: null,
  dataMarch: {
    pointRestTime: 1, // hour
    dayNightRestTime: 8, // hour
    dailyRestTime: 24, // hour
  },
  pointsTypes: [
    { id: 0, name: 'Пункт на маршруті' },
    { id: 1, name: 'Пункт привалу' },
    { id: 2, name: 'Пункт денного (нічного) відпочинку' },
    { id: 3, name: 'Пункт добового відпочинку' },
    { id: 4, name: 'Рубіж регулювання' },
  ],
  indicatorsICT: [],
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
    default:
      return state
  }
}
