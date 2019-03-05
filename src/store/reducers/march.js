import { march } from '../actions'

const initState = {
  marchEdit: true,
  indicators: [],
}

export default function reducer (state = initState, action) {
  const { type, payload } = action

  switch (type) {
    case march.GET_TYPE_KINDS: {
      return { ...state, indicators: payload }
    }
    default:
      return state
  }
}
