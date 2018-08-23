import { action } from '../../utils/services'
import SelectionTypes from '../../constants/SelectionTypes'
import { withNotification } from './asyncAction'

export const SET_SELECTION = action('SET_SELECTION')
export const UPDATE_SELECTION = action('UPDATE_SELECTION')
export const CLEAR_SELECTION = action('CLEAR_SELECTION')
export const SHOW_CREATE_FORM = action('SHOW_CREATE_FORM')
export const SHOW_EDIT_FORM = action('SHOW_EDIT_FORM')
export const HIDE_FORM = action('HIDE_FORM')
export const SET_NEW_SHAPE = action('SET_NEW_SHAPE')
export const SET_NEW_SHAPE_COORDINATES = action('SET_NEW_SHAPE_COORDINATES')
export const UPDATE_NEW_SHAPE = action('UPDATE_NEW_SHAPE')

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
  const { app6Code: code, id: orgStructureId, symbolData } = unit
  dispatch(setNewShape({
    type: SelectionTypes.POINT,
    code,
    orgStructureId,
    coordinatesArray: [ point ],
    amplifiers: JSON.parse(symbolData || '{}'),
  }))
  dispatch(showCreateForm)
})
