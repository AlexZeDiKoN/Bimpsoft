import * as actions from '../actions/viewModes'

const initialState = {
  edit: false,
  text: false,
  print: false,
  rightPanel: true,
}

export default function reducer (state = initialState, action) {
  const { type, payload: name } = action
  switch (type) {
    case actions.VIEW_MODE_TOGGLE: {
      const mode = state[name]
      const newState = { ...state, [name]: !mode }
      return newState
    }
    case actions.VIEW_MODE_DISABLE: {
      return { ...state, [name]: false }
    }
    default:
      return state
  }
}
