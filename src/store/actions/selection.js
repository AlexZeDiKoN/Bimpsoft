import { batchActions } from 'redux-batched-actions'
import { List } from 'immutable'
import { model } from '@C4/MilSymbolEditor'
import moment from 'moment'
import { action } from '../../utils/services'
import { getShift, calcMiddlePoint, calcShiftWM } from '../../utils/mapObjConvertor'
import SelectionTypes from '../../constants/SelectionTypes'
import {
  canEditSelector,
  taskModeSelector,
  targetingModeSelector,
  sameObjects,
  mapCOP,
  selectedLayerId,
  selectedNewShape,
  catalogCurrentLayerAttributesFields,
  isCatalogLayerFunc,
  getCatalogMetaLayers,
} from '../selectors'
import { GROUPS, entityKindCanMirror } from '../../components/WebMap/entityKind'
import { createObjectRecord, WebMapAttributes, WebMapObject } from '../reducers/webMap'
import { Align, propertyPath } from '../../constants'
import { amps } from '../../constants/symbols'
import {
  layersCOP,
  verificationNotReliableInformation,
  verificationNotReliableSource,
  verificationReliableInformation,
  verificationReliableSource,
} from '../../constants/cop'
import { IDENTITIES } from '../../utils/affiliations'
import { withNotification } from './asyncAction'
import { webMap, catalogs as catalogActions } from './'

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
export const DISABLE_SAVE_BUTTON = action('DISABLE_SAVE_BUTTON')
export const ENABLE_SAVE_BUTTON = action('ENABLE_SAVE_BUTTON')

const {
  APP6Code: {
    setIdentity2,
    setSymbol,
    setStatus,
  },
  symbolOptions,
} = model

export const LENGTH_APP6_CODE = 20 // ??????-???? ???????????????? ?? ????????
const GET_DEFAULT_APP6_CODE = (identity = '3') => setStatus(
  setSymbol(
    setIdentity2('10000000000000000000', identity)
    , '10')
  , '0')

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
  if (
    !taskModeSelector(state) && !targetingModeSelector(state) && (!object || !GROUPS.GENERALIZE.includes(object.type))
  ) {
    dispatch(setPreview(object))
    dispatch(catalogActions.loadCatalogContactsNames(id))
  }
}

const closeForm = () => ({
  type: HIDE_FORM,
})

export const hideForm = () => async (dispatch) => {
  await dispatch(closeForm())
  // ?????????? ???????????????? ?????????????? ???????????????????? ?????????? ???? ??????????
  if (document.activeElement.tagName.toUpperCase() === 'BODY') {
    document.getElementById('main').focus()
  }
}

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
  catalogActions.setCatalogErrors(),
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
  const state = getState()
  const {
    selection: { newShape: { type } },
    layers: { selectedId: layer },
    webMap: { subordinationLevel: level },
    orgStructures,
  } = state
  geometry = List(geometry)
  const affiliationTypeID = orgStructures?.formation?.affiliationTypeID
  const affiliation = affiliationTypeID ? String(affiliationTypeID) : IDENTITIES.FRIEND
  let object = WebMapObject({ type, layer, level, geometry, point, affiliation })

  const isCatalogLayer = isCatalogLayerFunc(state)(layer)
  const commonCatalogLayerProps = getCatalogMetaLayers(state)[layer]
  if (isCatalogLayer && commonCatalogLayerProps) {
    object = object.updateIn(propertyPath.PROPERTY_PATH.ATTRIBUTES,
      (attributes) => attributes.merge(commonCatalogLayerProps.attributes ?? {}),
    )
  }

  switch (type) {
    case SelectionTypes.POINT:
      await dispatch(batchActions([
        setNewShape({}),
        setPreview(object
          .set(
            'code',
            (isCatalogLayer && commonCatalogLayerProps)
              ? commonCatalogLayerProps.code
              : GET_DEFAULT_APP6_CODE(affiliationTypeID),
          )
          .setIn([ 'attributes', amps.dtg ], moment()),
        ),
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
      await dispatch(batchActions([
        setNewShape({}),
        setPreview(object.set('type', type)),
      ]))
      /* const id = await dispatch(webMap.addObject(object.toJS()))
      await dispatch(batchActions([
        selectedList([ id ]),
        showEditForm(id),
      ])) */
      break
    }
    default:
      break
  }
  dispatch(disableDrawUnit())
})

export const getUnitObj = ({ unitID, point, dictionaries, state }) => {
  const {
    orgStructures,
    layers: {
      selectedId: layer,
    },
  } = state
  const unit = orgStructures.byIds[unitID] || {}

  const { app6Code: code, id, symbolData, natoLevelID } = unit
  const formationCountryId = orgStructures?.formation?.countryID
  const countriesList = dictionaries?.Countries ?? []
  const countryFormation = countriesList.find(({ id }) => formationCountryId === id)

  const attributes = symbolData || {}
  attributes[amps.dtg] = moment()
  attributes[amps.country] = countryFormation?.codeA3 ?? ''

  return {
    type: SelectionTypes.POINT,
    code,
    layer,
    unit: id,
    level: natoLevelID,
    geometry: List([ point ]),
    point: point,
    attributes: WebMapAttributes(attributes),
  }
}

export const newShapeFromUnit = (unitID, point) => withNotification(async (dispatch, getState, { milOrgApi }) => {
  const dictionaries = await milOrgApi.allDc()
  dispatch(setPreview(WebMapObject(getUnitObj({ unitID, point, dictionaries, state: getState() }))))
})

export const newShapeFromSymbol = (data, point) => withNotification((dispatch, getState) => {
  const {
    layers: {
      selectedId: layer,
    },
  } = getState()

  const { code, amp, hint } = data

  amp[amps.dtg] = moment()

  dispatch(setPreview(WebMapObject({
    type: SelectionTypes.POINT,
    code,
    layer,
    geometry: List([ point ]),
    point: point,
    attributes: WebMapAttributes({ name: hint, ...amp } || {}),
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
    if (Array.isArray(clipboard) && clipboard.length) {
      const hashList = objects
        .filter((obj) => obj.layer === layer)
        .map((obj) => obj.hash || null)
        .toArray()
      return dispatch(webMap.copyList(clipboard[0].layer, layer, clipboard.map((clipboardObject) => {
        const { id, type, geometry: g } = clipboardObject
        const [ geometry, steps ] = getShift(hashList, type, g, zoom)
        const data = GROUPS.GROUPED_OR_COMBINED.includes(type)
          ? {
            id,
            shift: calcShiftWM(zoom, steps),
          }
          : {
            ...clipboardObject,
            geometry,
            point: calcMiddlePoint(geometry),
          }
        return { type, data }
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
  const { layers: { selectedId }, webMap: { objects }, flexGrid: { flexGrid } } = state
  let { selection: { list = [] } } = state
  if (list.length !== 1 || !list[0] || list[0] !== flexGrid.get('id')) {
    list = list.filter((id) => {
      const obj = objects.get(id)
      return obj && obj.layer === selectedId
    })
  }
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

export const showErrorPasteForm = (doubleObjects) => ({
  type: SHOW_ERROR_PASTE_FORM,
  doubleObjects,
})

export const showErrorSaveForm = (errorCode) => ({
  type: SHOW_ERROR_SAVE_FORM,
  errorCode,
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
  if (list.length === 1) {
    const id = list[0]
    const obj = objects.get(id)
    if (!obj || !entityKindCanMirror.includes(obj.type)) {
      return
    }
    const geometry = obj.geometry.toArray().reverse().map((data) => data.toObject())
    const point = obj.point.toObject()
    dispatch(webMap.updateObjectGeometry(id, { geometry, point }))
  }
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
    const state = getState()
    let { selection: { list } } = state
    const {
      layers: { selectedId: layer },
      webMap: { objects },
    } = state

    list = list.filter((id) => {
      const obj = objects.get(id)
      return obj && obj.layer === layer
    })

    if (list.length > 1) {
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

// ?????????????????? ???? ???????????????????????? ?????????????????????? ?????? ?????????????????? ?????????????????? ????'?????????? ???????????????????? (???????????????? ????????) ???? ???????????? ????????
// ?????? ???????????????????? ??????????????? ????????????????????
// ???? ???????????????????? ????????????? ?????? ?????????????????? ????????????????????
export const errorSymbol = {
  duplication: 1,
  code: 2,
}

export const disableSaveButton = () => ({
  type: DISABLE_SAVE_BUTTON,
})

export const enableSaveButton = () => ({
  type: ENABLE_SAVE_BUTTON,
})

const changeLayerByCredibilityCOP = () => (dispatch, getState) => {
  const state = getState()
  const isCOP = mapCOP(state)
  if (isCOP) {
    const { selection: { preview } } = state
    const evaluationRating = preview.getIn([ 'attributes', symbolOptions.evaluationRating ])
    const [ source, info ] = String(evaluationRating || '').split('')
    if (verificationReliableSource.includes(source) && verificationReliableInformation.includes(info)) {
      dispatch(setPreview(preview.set('layer', layersCOP.intelligenceReliable)))
    }
    if (verificationNotReliableSource.includes(source) || verificationNotReliableInformation.includes(info)) {
      dispatch(setPreview(preview.set('layer', layersCOP.intelligenceNotReliable)))
    }
  }
}

const checkCatalogSuccess = () => (dispatch, getState) => {
  const state = getState()
  const { selection: { preview } } = state
  const catalogAttributeFields = catalogCurrentLayerAttributesFields(state)
  const catalogAttributes = preview.getIn(propertyPath.PROPERTY_PATH.CATALOG_ATTRIBUTES)

  const errorsFields = catalogAttributeFields.filter((field) => {
    const { required, fieldName } = field
    return (required && fieldName !== 'location') ? !catalogAttributes[fieldName] : false
  })
  if (errorsFields.length) {
    dispatch(catalogActions.setCatalogErrors(
      Object.fromEntries(errorsFields.map(({ fieldName }) => [ fieldName, true ])),
    ))
    return false
  }
  dispatch(catalogActions.setCatalogErrors())

  dispatch(setPreview(preview))
  return true
}

export const checkSaveSymbol = () =>
  withNotification((dispatch, getState) => {
    dispatch(disableSaveButton())
    const state = getState()
    const {
      selection: { preview },
      webMap: { objects },
      layers: { selectedId },
    } = state
    const { type, unit } = preview
    if (type === SelectionTypes.POINT && objects && unit !== null) {
      const { code, id } = preview
      const ident = sameObjects({ code, unit, type, layerId: selectedId }, objects)
        .filter((symbol, index) => (Number(index) !== Number(id)))
      let errorCode = 0
      if (ident && ident.size > 0) {
        errorCode = errorCode | errorSymbol.duplication
      }
      if (code.length < LENGTH_APP6_CODE) {
        errorCode = errorCode | errorSymbol.code
      }
      if (errorCode) {
        return dispatch(showErrorSaveForm(errorCode))
      }
      dispatch(changeLayerByCredibilityCOP())
    }
    if (isCatalogLayerFunc(state)(selectedId) && !dispatch(checkCatalogSuccess())) {
      return false
    }
    return dispatch(savePreview())
  })

export const onToggleCatalogElementSelection = () => (dispatch, getState) => {
  const state = getState()
  const selectedLayer = selectedLayerId(state)
  const selectedShapeType = selectedNewShape(state)?.type
  const commonLayerType = getCatalogMetaLayers(state)[selectedLayer]?.type
  dispatch(setNewShape(selectedShapeType !== commonLayerType ? { type: commonLayerType } : {}))
}
