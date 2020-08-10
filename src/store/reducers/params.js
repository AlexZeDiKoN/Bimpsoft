import { actionNames } from '../actions/params'
import { paramsNames, SCALES, INIT_VALUES } from '../../constants'

const initialState = {
  [paramsNames.POINT_SIZE_MIN]: 4,
  [paramsNames.POINT_SIZE_MAX]: 90,
  [paramsNames.TEXT_SIZE_MIN]: 4,
  [paramsNames.TEXT_SIZE_MAX]: 70,
  [paramsNames.LINE_SIZE_MIN]: 4,
  [paramsNames.LINE_SIZE_MAX]: 70,
  [paramsNames.NODE_SIZE_MIN]: 4,
  [paramsNames.NODE_SIZE_MAX]: 70,
  [paramsNames.TEXT_AMPLIFIER_SIZE_MIN]: 4,
  [paramsNames.TEXT_AMPLIFIER_SIZE_MAX]: 70,
  [paramsNames.GRAPHIC_AMPLIFIER_SIZE_MIN]: 4,
  [paramsNames.GRAPHIC_AMPLIFIER_SIZE_MAX]: 70,
  [paramsNames.WAVE_SIZE_MIN]: 2,
  [paramsNames.WAVE_SIZE_MAX]: 40,
  [paramsNames.BLOCKAGE_SIZE_MIN]: 4,
  [paramsNames.BLOCKAGE_SIZE_MAX]: 80,
  [paramsNames.MOAT_SIZE_MIN]: 4,
  [paramsNames.MOAT_SIZE_MAX]: 80,
  [paramsNames.ROW_MINE_SIZE_MIN]: 4,
  [paramsNames.ROW_MINE_SIZE_MAX]: 80,
  [paramsNames.STROKE_SIZE_MIN]: 3,
  [paramsNames.STROKE_SIZE_MAX]: 36,
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
