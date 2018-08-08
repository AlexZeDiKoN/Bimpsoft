export const SET_SELECTION = 'SET_SELECTION'
export const UPDATE_SELECTION = 'UPDATE_SELECTION'
export const CLEAR_SELECTION = 'CLEAR_SELECTION'
export const SHOW_CREATE_FORM = 'SHOW_CREATE_FORM'
export const SHOW_EDIT_FORM = 'SHOW_EDIT_FORM'
export const HIDE_FORM = 'HIDE_FORM'
export const SET_NEW_SHAPE = 'SET_NEW_SHAPE'
export const SET_NEW_SHAPE_COORDINATES = 'SET_NEW_SHAPE_COORDINATES'

export const setSelection = (data) => ({
  type: SET_SELECTION,
  data,
})
export const showCreateForm = () => ({
  type: SHOW_CREATE_FORM,
})
export const showEditForm = () => ({
  type: SHOW_EDIT_FORM,
})
export const hideForm = () => ({
  type: HIDE_FORM,
})
export const updateSelection = (data) => ({
  type: UPDATE_SELECTION,
  data,
})

export const clearSelection = () => ({
  type: CLEAR_SELECTION,
})

export const setNewShape = (newShape) => ({
  type: SET_NEW_SHAPE,
  newShape,
})
export const setNewShapeCoordinates = (coordinates) => ({
  type: SET_NEW_SHAPE_COORDINATES,
  coordinates,
})
