import * as actions from '../actions/selection'

const initState = {
  showForm: false,
  data: null,
}

export default function reducer (state = initState, action) {
  const { type } = action
  switch (type) {
    case actions.SET_SELECTION: {
      const { data } = action
      return { ...state, data, showForm: false }
    }
    case actions.SHOW_FORM: {
      return { ...state, showForm: true }
    }
    case actions.HIDE_FORM: {
      return { ...state, showForm: false }
    }
    case actions.UPDATE_SELECTION: {
      const { data } = state
      if (data === null) {
        return state
      }
      const { data: newData } = action
      const mergedData = Array.isArray(data) ? data.map((item) => ({ ...item, ...newData })) : { ...data, ...newData }
      return { ...state, data: mergedData }
    }
    case actions.CLEAR_SELECTION: {
      return null
    }
    default:
      return state
  }
}
