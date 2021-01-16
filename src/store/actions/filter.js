import { List } from 'immutable'
import { utils } from '@C4/CommonComponents'
import * as R from 'ramda'
import { action } from '../../utils/services'
import { CATALOG_FILTER_TYPE, MIL_SYMBOL_FILTER_TYPE } from '../../constants/modals'
import { CATALOG_FILTERS, CATALOGS_FIELDS, LOADING, MIL_SYMBOL_FILTER, SEARCH_FILTER } from '../../constants/filter'
import { catalogsFields, getFilteredObjects, getModalData, milSymbolFilters, selectedLayerId } from '../selectors'
import { WebMapObject } from '../reducers/webMap'
import SelectionTypes from '../../constants/SelectionTypes'
import { setModalData, close } from './task'
import { copyList } from './webMap'
import { asyncAction, layers } from './index'

const { vld } = utils

export const MERGE_FILTERS = action('MERGE_FILTERS')
export const mergeFilter = (name, value, index) => ({ type: MERGE_FILTERS, payload: { name, value, index } })
export const setCatalogFields = mergeFilter.bind(null, CATALOGS_FIELDS)
export const setFilterCatalog = mergeFilter.bind(null, CATALOG_FILTERS)
export const mergeMilSymbolFilter = mergeFilter.bind(null, MIL_SYMBOL_FILTER)

export const REMOVE_FILTER = action('REMOVE_FILTER')
export const removeFilter = (name, value) => ({ type: REMOVE_FILTER, payload: { name, value } })
export const removeFilterCatalog = removeFilter.bind(null, CATALOG_FILTERS)

export const SET_FILTERS = action('SET_FILTERS')
export const setFilter = (name, value) => ({ type: SET_FILTERS, payload: { name, value } })
export const setSearchFilter = setFilter.bind(null, SEARCH_FILTER)
export const setMilSymbolFilter = setFilter.bind(null, MIL_SYMBOL_FILTER)
export const setLoading = setFilter.bind(null, LOADING)

export const openModalCatalogFilter = (id) => asyncAction.withNotification(
  async (dispatch, getState, { catalogApi }) => {
    const state = getState()
    if (!catalogsFields(state)[id]) {
      const catalogFields = await catalogApi.getCatalogItemInfo(id)
      dispatch(setCatalogFields({ [id]: catalogFields }))
    }
    dispatch(setModalData({ type: CATALOG_FILTER_TYPE, id }))
  })

export const openMilSymbolModal = (index) => (dispatch, getState) => {
  const state = getState()
  typeof index === 'number'
    ? dispatch(setModalData({
      ...milSymbolFilters(state)[index],
      type: MIL_SYMBOL_FILTER_TYPE,
      isNew: false,
      index,
    }))
    : dispatch(setModalData({
      type: MIL_SYMBOL_FILTER_TYPE,
      isNew: true,
      inCurrentLayer: false,
      visible: true,
      name: null,
      data: new WebMapObject({
        type: SelectionTypes.POINT,
        code: '10000000000000000000',
        layer: selectedLayerId(state),
        geometry: List([ ]),
      }),
    }))
}

export const onSaveMilSymbolFilters = (data) => (dispatch, getState) => {
  const validation = vld.validate({ name: R.pipe(vld.defined, vld.notNull, vld.text(1, 200)) }, data)
  if (!vld.isValid(validation)) {
    return { errors: { name: true } }
  }
  const state = getState()
  const { index, visible } = getModalData(state)
  dispatch(mergeMilSymbolFilter({ ...data, visible }, index))
  dispatch(close())
}

export const onRemoveMilSymbolFilter = () => (dispatch, getState) => {
  const state = getState()
  const { index } = getModalData(state)
  const filters = milSymbolFilters(state).filter((_, curIndex) => curIndex !== index)
  dispatch(setMilSymbolFilter(filters))
  dispatch(close())
}

export const onChangeMilSymbolVisible = (visible, index) => (dispatch, getState) => {
  const state = getState()
  const dataList = milSymbolFilters(state) ?? []
  index === 'number'
    ? dispatch(mergeMilSymbolFilter({ ...dataList[index], visible }, index))
    : dispatch(setMilSymbolFilter(dataList.map((data) => ({ ...data, visible }))))
}

export const onCreateLayerAndCopyUnits = (data) => asyncAction.withNotification(async (dispatch, getState) => {
  dispatch(setLoading(true))
  const result = await dispatch(layers.createLayer(data))
  if (result.success) {
    const state = getState()
    const toLayer = result.payload
    const points = getFilteredObjects(state)
      .filter((item) => item.type === SelectionTypes.POINT)
      .map((item) => item?.toJS ? item?.toJS() : item)
    const layersIds = points.reduce((acc, current) => {
      const sendObj = { type: SelectionTypes.POINT, data: current }
      const layerData = acc[current.layer] ? [ ...acc[current.layer], sendObj ] : [ sendObj ]
      return { ...acc, [current.layer]: layerData }
    }, {})
    await Promise.all(
      Object.entries(layersIds).map(([ fromLayer, ids ]) => dispatch(copyList(fromLayer, toLayer, ids))),
    )
    dispatch(close())
  } else {
    return result
  }
  dispatch(setLoading(false))
})
