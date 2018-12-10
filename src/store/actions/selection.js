import { batchActions } from 'redux-batched-actions'
import { action } from '../../utils/services'
import SelectionTypes from '../../constants/SelectionTypes'
import { canEditSelector } from '../selectors'
import { fromSelection } from '../../utils/mapObjConvertor'
import { withNotification } from './asyncAction'
import { webMap } from './'

export const SHOW_CREATE_FORM = action('SHOW_CREATE_FORM')
export const SHOW_EDIT_FORM = action('SHOW_EDIT_FORM')
export const HIDE_FORM = action('HIDE_FORM')
export const SET_NEW_SHAPE = action('SET_NEW_SHAPE')
export const SET_NEW_SHAPE_COORDINATES = action('SET_NEW_SHAPE_COORDINATES')
export const SHOW_DELETE_FORM = action('SHOW_DELETE_FORM')
export const UPDATE_NEW_SHAPE = action('UPDATE_NEW_SHAPE')
export const SELECTED_LIST = action('SELECTED_LIST')
export const CLIPBOARD_SET = action('CLIPBOARD_SET')
export const CLIPBOARD_CLEAR = action('CLIPBOARD_CLEAR')

export const selectedList = (list) => ({
  type: SELECTED_LIST,
  list,
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

export const updateSelection = (data) => withNotification(async (dispatch) => {
  await dispatch(webMap.updateObject(fromSelection(data)))
  await dispatch(hideForm())
})

export const setNewShape = (newShape) => ({
  type: SET_NEW_SHAPE,
  newShape,
})

export const finishNewShape = (newShapeData) => withNotification(async (dispatch) => {
  const id = await dispatch(webMap.addObject(fromSelection(newShapeData)))
  await dispatch(batchActions([
    selectedList([ id ]),
    hideForm(),
    webMap.setScaleToSelection(false),
  ]))
})

export const finishDrawNewShape = ({ geometry, point }) => withNotification(async (dispatch, getState) => {
  const {
    selection: { newShape: { type } },
    layers: { selectedId: layer },
    webMap: { subordinationLevel: level },
  } = getState()

  switch (type) {
    case SelectionTypes.POINT:
    case SelectionTypes.TEXT:
      await dispatch(setNewShape({ type, layer, subordinationLevel: level, coordinatesArray: geometry }))
      await dispatch(showCreateForm)
      break
    case SelectionTypes.SEGMENT:
    case SelectionTypes.AREA:
    case SelectionTypes.CURVE:
    case SelectionTypes.POLYGON:
    case SelectionTypes.POLYLINE:
    case SelectionTypes.CIRCLE:
    case SelectionTypes.RECTANGLE:
    case SelectionTypes.SQUARE: {
      const id = await dispatch(webMap.addObject({ type, layer, level, geometry, point }))
      await dispatch(selectedList([ id ]))
      await dispatch(showEditForm)
      break
    }
    default:
      break
  }
})

export const newShapeFromUnit = (unitID, point) => withNotification((dispatch, getState) => {
  const {
    orgStructures: { unitsById: { [unitID]: unit = {} } },
    layers: { selectedId: layer },
  } = getState()
  const { app6Code: code, id, symbolData, natoLevelID } = unit
  dispatch(setNewShape({
    type: SelectionTypes.POINT,
    code,
    layer,
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
        dispatch(webMap.addObject(clipboardObject))
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
    await dispatch(webMap.deleteObject(id))
  }
  dispatch(batchActions([
    hideForm(),
    selectedList([]),
    webMap.setScaleToSelection(false),
  ]))
})

export const showDeleteForm = () => ({
  type: SHOW_DELETE_FORM,
})
