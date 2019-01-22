import * as actions from '../actions/flexGrid'

const initState = {
  options: false,
  visible: false,
  directions: 4,
  zones: 3,
  vertical: true,
  present: false,
}

export default function reducer (state = initState, action) {
  const { type, payload } = action
  switch (type) {
    case actions.DROP_FLEX_GRID: {
      return { ...state, options: false, visible: true }
    }
    case actions.SET_DIRECTIONS: {
      return { ...state, directions: payload }
    }
    case actions.SET_ZONES: {
      const zones = payload ? 3 : 1
      return { ...state, zones }
    }
    case actions.FLEX_GRID_CREATED: {
      return { ...state, present: true }
    }
    case actions.FLEX_GRID_DELETED: {
      return { ...state, present: false, visible: false }
    }
    case actions.SHOW_FLEX_GRID_FORM: {
      const delta = state.present
        ? { visible: true }
        : { options: true }
      return { ...state, ...delta }
    }
    case actions.HIDE_FLEX_GRID: {
      return { ...state, visible: false }
    }
    case actions.CLOSE_FLEX_GRID_FORM: {
      return { ...state, options: false }
    }
    default:
      return state
  }
}
