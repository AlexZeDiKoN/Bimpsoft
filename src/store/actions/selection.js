import { action } from '../../utils/services'
import SelectionTypes from '../../constants/SelectionTypes'
import { withNotification } from './asyncAction'
import { deleteObject } from './webMap'

export const SET_SELECTION = action('SET_SELECTION')
export const UPDATE_SELECTION = action('UPDATE_SELECTION')
export const CLEAR_SELECTION = action('CLEAR_SELECTION')
export const SHOW_CREATE_FORM = action('SHOW_CREATE_FORM')
export const SHOW_EDIT_FORM = action('SHOW_EDIT_FORM')
export const HIDE_FORM = action('HIDE_FORM')
export const SET_NEW_SHAPE = action('SET_NEW_SHAPE')
export const SET_NEW_SHAPE_COORDINATES = action('SET_NEW_SHAPE_COORDINATES')
export const UPDATE_NEW_SHAPE = action('UPDATE_NEW_SHAPE')
export const SELECTED_LIST = action('SELECTED_LIST')
export const CLIPBOARD_COPY = action('CLIPBOARD_COPY')
export const CLIPBOARD_PASTE = action('CLIPBOARD_PASTE')
export const CLIPBOARD_CUT = action('CLIPBOARD_CUT')
export const CLIPBOARD_DELETE = action('CLIPBOARD_DELETE')

export const selectedList = (list) => ({
  type: SELECTED_LIST,
  list,
})

export const setSelection = (data) => ({
  type: SET_SELECTION,
  data,
})

export const showCreateForm = {
  type: SHOW_CREATE_FORM,
}

export const showEditForm = {
  type: SHOW_EDIT_FORM,
}

export const hideForm = {
  type: HIDE_FORM,
}

export const updateSelection = (data) => ({
  type: UPDATE_SELECTION,
  data,
})

export const clearSelection = {
  type: CLEAR_SELECTION,
}

export const setNewShape = (newShape) => ({
  type: SET_NEW_SHAPE,
  newShape,
})

export const updateNewShape = (newShape) => ({
  type: UPDATE_NEW_SHAPE,
  newShape,
})

export const setNewShapeCoordinates = (coordinates) => ({
  type: SET_NEW_SHAPE_COORDINATES,
  coordinates,
})

export const newShapeFromUnit = (unitID, point) => withNotification((dispatch, getState) => {
  const {
    orgStructures: { unitsById: { [unitID]: unit = {} } },
  } = getState()
  const { app6Code: code, id, symbolData, natoLevelID } = unit
  dispatch(setNewShape({
    type: SelectionTypes.POINT,
    code,
    orgStructureId: id,
    subordinationLevel: natoLevelID,
    coordinatesArray: [ point ],
    amplifiers: JSON.parse(symbolData || '{}'),
  }))
  dispatch(showCreateForm)
})

export const copy = () => withNotification((dispatch, getState) => {
  const {
    selection: { list = [], data },
  } = getState()
  dispatch({
    type: CLIPBOARD_COPY,
    clipboard: data ? [ data.id ] : list,
  })
})
export const cut = () => withNotification((dispatch, getState) => {
  const {
    selection: { list = [], data },
  } = getState()
  dispatch({
    type: CLIPBOARD_COPY,
    list,
  })
  for (const obj of list) {
    dispatch(deleteObject(obj.id))
  }
})
export const paste = () => withNotification((dispatch, getState) => {

})
export const deleteSelected = () => withNotification((dispatch, getState) => {
  const {
    selection: { list = [], data },
  } = getState()

})
