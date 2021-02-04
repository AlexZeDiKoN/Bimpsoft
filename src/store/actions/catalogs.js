import { action } from '../../utils/services'
import { TOPOCODES } from '../../constants/TopoObj'
import { asyncAction } from './index'

export const CATALOG_SET_TREE = action('CATALOG_SET_TREE')
export const CATALOG_SET_LIST = action('CATALOG_SET_LIST')
export const CATALOG_DROP_LIST = action('CATALOG_DROP_LIST')
export const CATALOG_SELECT_ITEM = action('CATALOG_SELECT_ITEM')
export const CATALOG_EXPAND_ITEM = action('CATALOG_EXPAND_ITEM')
export const CATALOG_FILTER_TEXT = action('CATALOG_FILTER_TEXT')
export const UPDATE_CATALOG_LIST_ITEM = action('UPDATE_CATALOG_LIST_ITEM')
export const CATALOG_SET_TOPOGRAPHIC_FIELDS = action('CATALOG_SET_TOPOGRAPHIC_FIELDS')
export const CATALOG_SET_TOPOGRAPHIC_BY_IDS = action('CATALOG_SET_TOPOGRAPHIC_BY_IDS')

export const setTree = (payload) => ({
  type: CATALOG_SET_TREE,
  payload,
})

export const setList = (catalogId, list) => ({
  type: CATALOG_SET_LIST,
  payload: { catalogId, list },
})

export const getTree = () =>
  asyncAction.withNotification(async (dispatch, _, { catalogApi }) =>
    dispatch(setTree(await catalogApi.getTree())))

export const getList = (catalogId) =>
  asyncAction.withNotification(async (dispatch, _, { catalogApi }) =>
    dispatch(setList(catalogId, await catalogApi.getList(catalogId))))

export const dropList = (catalogId) => ({
  type: CATALOG_DROP_LIST,
  payload: catalogId,
})

export const setSelectedId = (selectedId) => ({
  type: CATALOG_SELECT_ITEM,
  selectedId,
})

export const setFilterText = (filterText) => ({
  type: CATALOG_FILTER_TEXT,
  filterText,
})

export const expandItem = (itemId) => ({
  type: CATALOG_EXPAND_ITEM,
  itemId,
})

export const updateListItem = (id, catalogId, item) => ({
  type: UPDATE_CATALOG_LIST_ITEM,
  payload: { id, catalogId, item },
})

export const updateCatalogObject = (id, catalogId) =>
  asyncAction.withNotification(async (dispatch, _, { catalogApi }) => {
    const item = await catalogApi.getCatalogItem(id, catalogId)
    return dispatch(updateListItem(id, catalogId, item))
  })

export const setTopographicObjectFields = (payload) => ({
  type: CATALOG_SET_TOPOGRAPHIC_FIELDS,
  payload,
})

export const setTopographicObjectByIds = (payload) => ({
  type: CATALOG_SET_TOPOGRAPHIC_BY_IDS,
  payload,
})

export const getTopographicObjectFields = () =>
  asyncAction.withNotification(async (dispatch, _, { catalogApi }) =>
    dispatch(setTopographicObjectFields(await catalogApi.getTopographicObjectFields(TOPOCODES))))
