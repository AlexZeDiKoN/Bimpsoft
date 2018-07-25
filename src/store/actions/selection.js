export const SET_SELECTION = 'SET_SELECTION'
export const UPDATE_SELECTION = 'UPDATE_SELECTION'
export const CLEAR_SELECTION = 'CLEAR_SELECTION'
export const SHOW_FORM = 'SHOW_FORM'
export const HIDE_FORM = 'HIDE_FORM'

export const setSelection = (data) => ({
  type: SET_SELECTION,
  data,
})
export const showForm = () => ({
  type: SHOW_FORM,
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
