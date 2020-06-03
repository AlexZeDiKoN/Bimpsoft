import { batchActions } from 'redux-batched-actions'
import { List } from 'immutable'
import { model } from '@DZVIN/MilSymbolEditor'
import { action } from '../../utils/services'
import { getShift, calcMiddlePoint, calcShiftWM } from '../../utils/mapObjConvertor'
import SelectionTypes from '../../constants/SelectionTypes'
import { canEditSelector, taskModeSelector, targetingModeSelector, sameObjects } from '../selectors'
import entityKind, { GROUPS } from '../../components/WebMap/entityKind'
import { createObjectRecord, WebMapAttributes, WebMapObject } from '../reducers/webMap'
import { Align } from '../../constants'
import { withNotification } from './asyncAction'
import { webMap } from './'

export const SHOW_CREATE_FORM = action('SHOW_CREATE_FORM')
export const SHOW_EDIT_FORM = action('SHOW_EDIT_FORM')
export const HIDE_FORM = action('HIDE_FORM')
export const DISABLE_DRAW = action('DISABLE_DRAW')
export const SET_DATA_PREVIEW = action('SET_DATA_PREVIEW')
export const SET_NEW_SHAPE = action('SET_NEW_SHAPE')
export const SET_NEW_SHAPE_COORDINATES = action('SET_NEW_SHAPE_COORDINATES')
export const SHOW_DELETE_FORM = action('SHOW_DELETE_FORM')
export const SHOW_ERROR_PASTE_FORM = action('SHOW_ERROR_PASTE_FORM')
export const SHOW_ERROR_SAVE_FORM = action('SHOW_ERROR_SAVE_FORM')
export const UPDATE_NEW_SHAPE = action('UPDATE_NEW_SHAPE')
export const SELECTED_LIST = action('SELECTED_LIST')
export const CLIPBOARD_SET = action('CLIPBOARD_SET')
export const CLIPBOARD_CLEAR = action('CLIPBOARD_CLEAR')
export const SET_PREVIEW_COORDINATE = action('SET_PREVIEW_COORDINATE')
export const SHOW_DIVIDE_FORM = action('SHOW_DIVIDE_FORM')
export const SHOW_COMBINE_FORM = action('SHOW_COMBINE_FORM')
export const CLEAR_BY_LAYER_ID = action('CLEAR_BY_LAYER_ID')

const {
  APP6Code: {
    setIdentity2,
    setSymbol,
    setStatus,
  },
} = model

const DEFAULT_APP6_CODE = setStatus(setSymbol(setIdentity2('10000000000000000000', '3'), '10'), '0')

export const selectedList = (list) => ({
  type: SELECTED_LIST,
  list,
})

export const clearByLayerId = (layerId) => ({
  type: CLEAR_BY_LAYER_ID,
  layerId,
})

export const showEditForm = (id) => (dispatch, getState) => {
  const state = getState()
  const { webMap: { objects } } = state
  const object = objects.get(id)
  if (!taskModeSelector(state) && !targetingModeSelector(state)) {
    dispatch(setPreview(object))
  }
}

export const hideForm = () => ({
  type: HIDE_FORM,
})

export const disableDrawUnit = () => ({
  type: DISABLE_DRAW,
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
      dispatch(setPreview(null))
    } else {
      const id = await dispatch(webMap.addObject(data))
      await dispatch(batchActions([
        setPreview(null),
        selectedList([ id ]),
        webMap.setScaleToSelection(false),
      ]))
    }
  }
})

export const clearPreview = () => batchActions([
  hideForm(),
  setPreview(null),
])

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
          texts.push({
            text: '',
            underline: true,
            align: Align.CENTER,
            size: 16,
          }),
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
      const id = await dispatch(webMap.addObject(object.toJS()))
      await dispatch(batchActions([
        selectedList([ id ]),
        showEditForm(id),
      ]))
      break
    }
    default:
      break
  }
  dispatch(disableDrawUnit())
})

export const newShapeFromUnit = (unitID, point) => withNotification((dispatch, getState) => {
  const {
    orgStructures,
    layers: {
      selectedId: layer,
    },
  } = getState()

  const unit = orgStructures.byIds[unitID] || {}

  const { app6Code: code, id, symbolData, natoLevelID } = unit

  dispatch(setPreview(WebMapObject({
    type: SelectionTypes.POINT,
    code,
    layer,
    unit: id,
    level: natoLevelID,
    geometry: List([ point ]),
    point: point,
    attributes: WebMapAttributes(symbolData || {}),
  })))
})

export const newShapeFromSymbol = (data, point) => withNotification((dispatch, getState) => {
  const {
    layers: {
      selectedId: layer,
    },
  } = getState()

  const { code, amp } = data

  dispatch(setPreview(WebMapObject({
    type: SelectionTypes.POINT,
    code,
    layer,
    geometry: List([ point ]),
    point: point,
    attributes: WebMapAttributes(amp || {}),
  }),
  ))
})

export const newShapeFromLine = (data, point, geometry) => withNotification((dispatch, getState) => {
  const {
    layers: {
      selectedId: layer,
    },
  } = getState()

  const { code, amp } = data

  dispatch(
    setPreview(
      WebMapObject({
        type: amp.type,
        code,
        layer,
        geometry: List(geometry),
        point: point,
        attributes: createObjectRecord(amp),
      }),
    ),
  )
})

export const copy = () => withNotification((dispatch, getState) => {
  const {
    selection: { list = null },
    webMap: { objects },
  } = getState()

  const clipboardObjects = []
  if (Array.isArray(list)) {
    for (const id of list) {
      const obj = objects.get(id)
      if (obj) {
        const clipboardObject = obj.toJS()
        if (!GROUPS.COMBINED.includes(clipboardObject.type)) {
          delete clipboardObject.id
        }
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
  dispatch(hideForm())
  const state = getState()
  const canEdit = canEditSelector(state)
  if (!canEdit) {
    return
  }
  const {
    selection: { clipboard },
    webMap: { objects, zoom },
    layers: { selectedId: layer = null },
  } = state
  if (layer !== null) {
    if (Array.isArray(clipboard)) {
      const hashList = objects
        .filter((obj) => obj.layer === layer)
        .map((obj) => obj.hash || null)
        .toArray()
      dispatch(batchActions(clipboard.map((clipboardObject) => {
        const { id, type, geometry: g } = clipboardObject
        const [ geometry, steps ] = getShift(hashList, type, g, zoom)
        switch (type) {
          case entityKind.CONTOUR:
            return webMap.copyContour(
              id,
              layer,
              calcShiftWM(zoom, steps),
            )
          case entityKind.GROUPED_HEAD:
          case entityKind.GROUPED_LAND:
          case entityKind.GROUPED_REGION:
            return webMap.copyGroup(
              id,
              layer,
              calcShiftWM(zoom, steps),
            )
          default:
            return webMap.addObject({
              ...clipboardObject,
              layer,
              geometry,
              point: calcMiddlePoint(geometry),
            })
        }
      })))
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
  if (list.length) {
    await (
      list.length === 1
        ? dispatch(webMap.deleteObject(list[0]))
        : dispatch(webMap.deleteObjects(list))
    )
  }
  webMap.stopHeartBeat()
  dispatch(batchActions([
    hideForm(),
    selectedList([]),
    webMap.setScaleToSelection(false),
  ]))
})

export const showDeleteForm = () => ({
  type: SHOW_DELETE_FORM,
})

export const showErrorPasteForm = () => ({
  type: SHOW_ERROR_PASTE_FORM,
})

export const showErrorSaveForm = () => ({
  type: SHOW_ERROR_SAVE_FORM,
})

export const showDivideForm = () => ({
  type: SHOW_DIVIDE_FORM,
})

export const showCombineForm = () => ({
  type: SHOW_COMBINE_FORM,
})

export const mirrorImage = () => withNotification((dispatch, getState) => {
  const state = getState()
  const { selection: { list }, webMap: { objects } } = state
  const id = list[0]
  const obj = objects.get(id)
  const type = obj.type
  if (type === SelectionTypes.SQUARE ||
    type === SelectionTypes.CIRCLE) {
    return
  }
  const geometry = obj.geometry.toArray().reverse().map((data) => data.toObject())
  const point = obj.point.toObject()
  dispatch(webMap.updateObjectGeometry(id, { geometry, point }))
})

/* const refreshObject = async (webmapApi, objectId) => ({
  type: actionNames.REFRESH_OBJECT,
  payload: {
    id: objectId,
    object: fixServerObject(await webmapApi.objRefresh(objectId)),
  },
}) */

export const createContour = () =>
  withNotification(async (dispatch, getState, { webmapApi }) => {
    const {
      selection: { list },
      layers: { selectedId: layer },
    } = getState()

    const contour = await webmapApi.contourCreate(layer, list)

    if (contour) {
      dispatch(selectedList([ contour.id ]))
      dispatch({
        type: webMap.actionNames.ADD_UNDO_RECORD,
        payload: {
          changeType: webMap.changeTypes.CREATE_CONTOUR,
          id: contour.id,
          list,
          layer,
        },
      })
    }
  })

export const dropContour = () =>
  withNotification(async (dispatch, getState, { webmapApi }) => {
    const {
      selection: { list: [ contour ] },
      layers: { selectedId: layer },
    } = getState()

    const list = await webmapApi.contourDelete(layer, contour)

    if (list) {
      dispatch(batchActions([
        webMap.tryUnlockObject(contour),
        selectedList(list),
        {
          type: webMap.actionNames.ADD_UNDO_RECORD,
          payload: {
            changeType: webMap.changeTypes.DELETE_CONTOUR,
            id: contour,
            list,
            layer,
          },
        },
      ]))
    }
  })

// Перевірка та попередження користувача про створення однакових об'єктів обстановки (точковий знак) на одному шарі
// при зберіганні об’єкту обстановки
export const checkSaveSymbol = () =>
  withNotification((dispatch, getState) => {
    const {
      selection: { preview },
      webMap: { objects },
      layers: { selectedId },
    } = getState()
    const { type } = preview
    if (type === SelectionTypes.POINT && objects && preview) {
      const { unit, code, id } = preview
      const ident = sameObjects({ code, unit, type, layerId: selectedId }, objects).filter(
        (symbol, index) => (Number(index) !== Number(id)))
      if (ident && ident.size > 0) {
        return dispatch(showErrorSaveForm())
      }
    }
    return dispatch(savePreview())
  })
