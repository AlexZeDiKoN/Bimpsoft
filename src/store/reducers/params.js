import { actionNames } from '../actions/params'
import { SubordinationLevel, paramsNames, SCALES } from '../../constants'

const initialState = {
  [paramsNames.POINT_SIZE_MIN]: 4,
  [paramsNames.POINT_SIZE_MAX]: 96,
  [paramsNames.TEXT_SIZE_MIN]: 4,
  [paramsNames.TEXT_SIZE_MAX]: 96,
  [paramsNames.LINE_SIZE_MIN]: 4,
  [paramsNames.LINE_SIZE_MAX]: 96,
}

SCALES.forEach((scale) => (initialState[`${paramsNames.SCALE_VIEW_LEVEL}_${scale}`] = SubordinationLevel.TEAM_CREW))

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
