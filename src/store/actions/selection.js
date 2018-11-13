import { action } from '../../utils/services'
import SelectionTypes from '../../constants/SelectionTypes'
import { canEditSelector } from '../selectors'
import { withNotification } from './asyncAction'
import { deleteObject, addObject } from './webMap'

export const SET_SELECTION = action('SET_SELECTION')
export const UPDATE_SELECTION = action('UPDATE_SELECTION')
export const CLEAR_SELECTION = action('CLEAR_SELECTION')
export const SHOW_CREATE_FORM = action('SHOW_CREATE_FORM')
export const SHOW_EDIT_FORM = action('SHOW_EDIT_FORM')
export const HIDE_FORM = action('HIDE_FORM')
export const SET_NEW_SHAPE = action('SET_NEW_SHAPE')
export const SET_NEW_SHAPE_COORDINATES = action('SET_NEW_SHAPE_COORDINATES')
export const SHOW_DELETE_FORM = action('SHOW_DELETE_FORM')
export const HIDE_DELETE_FORM = action('HIDE_DELETE_FORM')
export const UPDATE_NEW_SHAPE = action('UPDATE_NEW_SHAPE')
export const SELECTED_LIST = action('SELECTED_LIST')
export const CLIPBOARD_SET = action('CLIPBOARD_SET')
export const CLIPBOARD_CLEAR = action('CLIPBOARD_CLEAR')

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

export const hideForm = () => ({
  type: HIDE_FORM,
})

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
  const state = getState()
  const canEdit = canEditSelector(state)
  if (!canEdit) {
    return
  }
  const {
    selection: { list = null },
    webMap: { objects },
  } = state

  const clipboardObjects = []
  if (Array.isArray(list)) {
    for (const id of list) {
      const obj = objects.get(id)
      if (obj) {
        const clipboardObject = { ...obj.toJS() }
        delete clipboardObject.id
        clipboardObjects.push(clipboardObject)
      }
    }
  }

  dispatch({
    type: CLIPBOARD_SET,
    clipboard: clipboardObjects,
  })
})

export const cut = () => withNotification((dispatch) => {
  dispatch(copy())
  dispatch(deleteSelected())
})

export const paste = () => withNotification((dispatch, getState) => {
  const state = getState()
  const canEdit = canEditSelector(state)
  if (!canEdit) {
    return
  }
  const {
    selection: { clipboard },
    layers: { selectedId: layer = null },
  } = state
  if (layer !== null) {
    if (Array.isArray(clipboard)) {
      for (const clipboardObject of clipboard) {
        clipboardObject.layer = layer
        dispatch(addObject(clipboardObject))
      }
    }
  }
})

export const deleteSelected = () => withNotification(async (dispatch, getState) => {
  const state = getState()
  const canEdit = canEditSelector(state)
  if (!canEdit) {
    return
  }
  const {
    selection: { list = [] },
  } = state
  for (const id of list) {
    await dispatch(deleteObject(id))
  }
  dispatch(hideForm())
  dispatch(selectedList([]))
})

export const showDeleteForm = () => ({
  type: SHOW_DELETE_FORM,
})
