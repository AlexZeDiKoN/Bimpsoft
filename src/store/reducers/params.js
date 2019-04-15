import { actionNames } from '../actions/params'
import { paramsNames, SCALES, INIT_VALUES } from '../../constants'

const initialState = {
  [paramsNames.POINT_SIZE_MIN]: 4,
  [paramsNames.POINT_SIZE_MAX]: 96,
  [paramsNames.TEXT_SIZE_MIN]: 4,
  [paramsNames.TEXT_SIZE_MAX]: 96,
  [paramsNames.LINE_SIZE_MIN]: 4,
  [paramsNames.LINE_SIZE_MAX]: 96,
  [paramsNames.NODE_SIZE_MIN]: 10,
  [paramsNames.NODE_SIZE_MAX]: 10,
  [paramsNames.WAVE_SIZE_MIN]: 10,
  [paramsNames.WAVE_SIZE_MAX]: 10,
  [paramsNames.STROKE_SIZE_MIN]: 10,
  [paramsNames.STROKE_SIZE_MAX]: 10,
}

SCALES.forEach((scale) => (initialState[`${paramsNames.SCALE_VIEW_LEVEL}_${scale}`] = INIT_VALUES[scale]))

export default function (state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case actionNames.LOAD_PARAMS: {
      return { ...state, ...payload }
    }
    case actionNames.LOAD_PARAM: {
      const { name, value } = payload
      return { ...state, [name]: value }
    }
    default:
      return state
  }
}
