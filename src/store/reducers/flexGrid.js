import * as actions from '../actions/flexGrid'

const MIN_DIRECTIONS = 1
const DEF_DIRECTIONS = 3
const MAX_DIRECTIONS = 10

const HAS_ZONES = 3
const HASNT_ZONES = 1

const initState = {
  options: false,
  visible: false,
  directions: DEF_DIRECTIONS,
  zones: HAS_ZONES,
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
      let directions = Number(payload)
      if (isNaN(directions) || directions < MIN_DIRECTIONS || directions > MAX_DIRECTIONS) {
        directions = DEF_DIRECTIONS
      }
      return { ...state, directions }
    }
    case actions.SET_ZONES: {
      const zones = payload ? HAS_ZONES : HASNT_ZONES
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
