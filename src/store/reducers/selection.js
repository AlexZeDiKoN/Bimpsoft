import * as actions from '../actions/selection'
import { FormTypes } from '../../constants'

const EMPTY_OBJECT = {}
Object.freeze(EMPTY_OBJECT)

const initState = {
  showForm: null,
  data: null,
  newShape: EMPTY_OBJECT,
  clipboard: null,
  list: [],
}

export default function reducer (state = initState, action) {
  const { type } = action
  switch (type) {
    case actions.SELECTED_LIST: {
      const { list } = action
      return { ...state, list }
    }
    case actions.SET_SELECTION: {
      const { data } = action
      return { ...state, data, showForm: null, newShape: EMPTY_OBJECT }
    }
    case actions.SHOW_CREATE_FORM: {
      return { ...state, showForm: FormTypes.CREATE }
    }
    case actions.SHOW_EDIT_FORM: {
      return { ...state, showForm: FormTypes.EDIT }
    }
    case actions.SHOW_DELETE_FORM: {
      return { ...state, showForm: FormTypes.DEL }
    }
    case actions.HIDE_FORM: {
      return { ...state, showForm: null, newShape: EMPTY_OBJECT, data: EMPTY_OBJECT }
    }
    case actions.UPDATE_SELECTION: {
      const { data } = state
      const { data: newData } = action
      const mergedData = data === null || newData === null
        ? newData
        : Array.isArray(data)
          ? data.map((item) => ({ ...item, ...newData }))
          : { ...data, ...newData }
      return { ...state, data: mergedData, showForm: null, newShape: EMPTY_OBJECT }
    }
    case actions.CLEAR_SELECTION: {
      return { ...state, data: null, newShape: EMPTY_OBJECT }
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
    case actions.CLIPBOARD_SET: {
      const { clipboard } = action
      return { ...state, clipboard }
    }
    case actions.CLIPBOARD_CLEAR: {
      return { ...state, clipboard: null }
    }
    default:
      return state
  }
}
