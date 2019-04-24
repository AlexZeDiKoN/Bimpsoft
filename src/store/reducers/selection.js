import * as actions from '../actions/selection'
import { FormTypes } from '../../constants'

const EMPTY_OBJECT = {}
Object.freeze(EMPTY_OBJECT)

const initState = {
  showForm: null,
  newShape: EMPTY_OBJECT,
  clipboard: null,
  list: [],
  preview: null,
  previewCoordinateIndex: null,
}

export default function reducer (state = initState, action) {
  const { type } = action
  switch (type) {
    case actions.SELECTED_LIST: {
      const { list } = action
      return { ...state, list }
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
      return { ...state, showForm: null, newShape: EMPTY_OBJECT }
    }
    case actions.SET_NEW_SHAPE: {
      const { newShape } = action
      return { ...state, newShape, showForm: null }
    }
    case actions.SET_DATA_PREVIEW: {
      const { preview } = action
      return { ...state, preview }
    }
    case actions.SET_PREVIEW_COORDINATE: {
      const { index, isActive } = action
      return { ...state, previewCoordinateIndex: isActive ? index : null }
    }
    case actions.UPDATE_NEW_SHAPE: {
      const { newShape } = action
      return { ...state, newShape: { ...state.newShape, ...newShape }, showForm: null }
    }
    case actions.SET_NEW_SHAPE_COORDINATES: {
      const { coordinatesArray } = action
      return { ...state, newShape: { ...state.newShape, coordinatesArray } }
    }
    case actions.CLIPBOARD_SET: {
      const { clipboard } = action
      return { ...state, clipboard }
    }
    case actions.CLIPBOARD_CLEAR: {
      return { ...state, clipboard: null }
    }
    case actions.SHOW_DIVIDE_FORM: {
      return { ...state, showForm: FormTypes.DIVIDE_DIR }
    }
    default:
      return state
  }
}
