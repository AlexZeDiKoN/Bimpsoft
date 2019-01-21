import * as actions from '../actions/flexGrid'

const initState = {
  options: false,
  visible: false,
  directions: 4,
  zones: 3,
  vertical: true,
}

export default function reducer (state = initState, action) {
  const { type, payload } = action
  switch (type) {
    case actions.DROP_FLEX_GRID: {
      return { ...state, options: false, visible: true }
    }
    case actions.SET_FLEX_GRID_OPTIONS: {
      const options = payload
      options.zones = options.zones ? 3 : 1
      return { ...state, ...options }
    }
    case actions.SHOW_FLEX_GRID_FORM: {
      return { ...state, options: true }
    }
    case actions.HIDE_FLEX_GRID: {
      return { ...state, visible: false }
    }
    default:
      return state
  }
}
