import { march } from '../actions'

const initState = {
  marchEdit: true,
  indicators: undefined,
  params: {
    segments: [],
  },
}

export default function reducer (state = initState, action) {
  const { type, payload } = action

  switch (type) {
    case march.GET_TYPE_KINDS: {
      const indicators = payload.reduce((prev, current) => ({ ...prev, [ current.typeCode ]: current }), {})
      return { ...state, indicators }
    }
    case march.SET_MARCH_PARAMS: {
      console.log(payload)
      const params = { ...state.params, ...payload }
      return { ...state, params }
    }
    case march.ADD_SEGMENT: {
      console.log(payload)
      return state
    }
    default:
      return state
  }
}
