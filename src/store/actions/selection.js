import { batchActions } from 'redux-batched-actions'
import { List } from 'immutable'
import { model } from '@DZVIN/MilSymbolEditor'
import { action } from '../../utils/services'
import SelectionTypes from '../../constants/SelectionTypes'
import { canEditSelector } from '../selectors'
import { WebMapObject } from '../reducers/webMap'
import { Align } from '../../constants'
import { withNotification } from './asyncAction'
import { webMap } from './'

export const SHOW_CREATE_FORM = action('SHOW_CREATE_FORM')
export const SHOW_EDIT_FORM = action('SHOW_EDIT_FORM')
export const HIDE_FORM = action('HIDE_FORM')
export const SET_DATA_PREVIEW = action('SET_DATA_PREVIEW')
export const SET_NEW_SHAPE = action('SET_NEW_SHAPE')
export const SET_NEW_SHAPE_COORDINATES = action('SET_NEW_SHAPE_COORDINATES')
export const SHOW_DELETE_FORM = action('SHOW_DELETE_FORM')
export const UPDATE_NEW_SHAPE = action('UPDATE_NEW_SHAPE')
export const SELECTED_LIST = action('SELECTED_LIST')
export const CLIPBOARD_SET = action('CLIPBOARD_SET')
export const CLIPBOARD_CLEAR = action('CLIPBOARD_CLEAR')
export const SET_PREVIEW_COORDINATE = action('SET_PREVIEW_COORDINATE')

const { APP6Code: { setIdentity2, setSymbol, setStatus } } = model
const DEFAULT_APP6_CODE = setStatus(setSymbol(setIdentity2('10000000000000000000', '3'), '10'), '0')

export const selectedList = (list) => ({
  type: SELECTED_LIST,
  list,
})

export const showEditForm = (id) => (dispatch, getState) => {
  const state = getState()
  const { webMap: { objects } } = state
  dispatch(setPreview(objects.get(id)))
}

export const hideForm = () => ({
  type: HIDE_FORM,
})

export const setPreview = (preview) => ({
  type: SET_DATA_PREVIEW,
  preview,
})

export const savePreview = () => withNotification(async (dispatch, getState) => {
  const { selection: { preview } } = getState()
  if (preview) {
    const data = preview.toJS()
    if (data.id) {
      await dispatch(webMap.updateObject(data))
      dispatch(batchActions([ setPreview(null, []) ]))
    } else {
      const id = await dispatch(webMap.addObject(data))
      await dispatch(batchActions([
        setPreview(null, []),
        selectedList([ id ]),
        webMap.setScaleToSelection(false),
      ]))
    }
  }
})

export const clearPreview = () => batchActions([ hideForm(), setPreview(null, []) ])

export const setPreviewCoordinate = (index, isActive) => ({
  type: SET_PREVIEW_COORDINATE,
  index,
  isActive,
})

export const setNewShape = (newShape) => ({
  type: SET_NEW_SHAPE,
  newShape,
})

export const finishDrawNewShape = ({ geometry, point }) => withNotification(async (dispatch, getState) => {
  const {
    selection: { newShape: { type } },
    layers: { selectedId: layer },
    webMap: { subordinationLevel: level },
  } = getState()

  geometry = List(geometry)
  const object = WebMapObject({ type, layer, level, geometry, point })

  switch (type) {
    case SelectionTypes.POINT:
      await dispatch(batchActions([
        setNewShape({}),
        setPreview(object.set('code', DEFAULT_APP6_CODE)),
      ]))
      break
    case SelectionTypes.TEXT:
      await dispatch(batchActions([
        setNewShape({}),
        setPreview(object.updateIn([ 'attributes', 'texts' ], (texts) =>
          texts.push({ text: '', underline: true, align: Align.CENTER, size: 16 })
        )),
      ]))
      break
    case SelectionTypes.SEGMENT:
    case SelectionTypes.AREA:
    case SelectionTypes.CURVE:
    case SelectionTypes.POLYGON:
    case SelectionTypes.POLYLINE:
    case SelectionTypes.CIRCLE:
    case SelectionTypes.RECTANGLE:
    case SelectionTypes.SQUARE: {
      const id = await dispatch(webMap.addObject(object))
      await dispatch(batchActions([
        selectedList([ id ]),
        showEditForm(id),
      ]))
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
  dispatch(setPreview(WebMapObject({
    type: SelectionTypes.POINT,
    code,
    layer,
    orgStructureId: id,
    subordinationLevel: natoLevelID,
    geometry: [ point ],
    point: point,
    attributes: JSON.parse(symbolData || '{}'),
  })))
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
