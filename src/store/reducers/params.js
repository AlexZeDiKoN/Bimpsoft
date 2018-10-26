import { actionNames } from '../actions/params'
import { paramsNames } from '../../constants'

const initialState = {
  [paramsNames.POINT_SIZE_MIN]: 4,
  [paramsNames.POINT_SIZE_MAX]: 96,
  [paramsNames.TEXT_SIZE_MIN]: 4,
  [paramsNames.TEXT_SIZE_MAX]: 96,
  [paramsNames.LINE_SIZE_MIN]: 4,
  [paramsNames.LINE_SIZE_MAX]: 96,
}

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
