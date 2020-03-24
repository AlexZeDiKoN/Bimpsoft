import { SET_SIDEBAR } from '../../constants'

const initState = {
  sidebar: false,
}

export default function reducer (state = initState, action) {
  const { type, payload } = action
  switch (type) {
    case SET_SIDEBAR: {
      return { ...state, sidebar: payload }
    }
    default:
      return state
  }
}
