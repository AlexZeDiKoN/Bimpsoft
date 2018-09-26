import { actionNames } from '../actions/params'

const initialState = {
  point_size_min: 4,
  point_size_max: 96,
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
