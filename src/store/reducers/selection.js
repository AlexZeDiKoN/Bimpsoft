import * as actions from '../actions/selection'

const initState = {
  showForm: null,
  data: null,
  newShape: {},
}

export default function reducer (state = initState, action) {
  const { type } = action
  switch (type) {
    case actions.SET_SELECTION: {
      const { data } = action
      return { ...state, data, showForm: null, newShape: {} }
    }
    case actions.SHOW_CREATE_FORM: {
      return { ...state, showForm: 'create' }
    }
    case actions.SHOW_EDIT_FORM: {
      return { ...state, showForm: 'edit' }
    }
    case actions.HIDE_FORM: {
      return { ...state, showForm: null, newShape: {}, data: {} }
    }
    case actions.UPDATE_SELECTION: {
      const { data } = state
      const { data: newData } = action
      const mergedData = data === null || newData === null
        ? newData
        : Array.isArray(data)
          ? data.map((item) => ({ ...item, ...newData }))
          : { ...data, ...newData }
      return { ...state, data: mergedData, showForm: null, newShape: {} }
    }
    case actions.CLEAR_SELECTION: {
      return { ...state, data: null, newShape: {} }
    }
    case actions.SET_NEW_SHAPE: {
      const { newShape } = action
      return { ...state, newShape, data: null, showForm: null }
    }
    case actions.UPDATE_NEW_SHAPE: {
      const { newShape } = action
      return { ...state, newShape: { ...state.newShape, ...newShape }, showForm: null }
    }
    case actions.SET_NEW_SHAPE_COORDINATES: {
      const { coordinates } = action
      const { coordinatesArray = [] } = state.newShape
      return { ...state, newShape: { ...state.newShape, coordinatesArray: [ ...coordinatesArray, coordinates ] } }
    }
    default:
      return state
  }
}
