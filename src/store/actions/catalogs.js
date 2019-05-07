import { action } from '../../utils/services'
import { asyncAction } from './index'

export const CATALOG_SET_TREE = action('CATALOG_SET_TREE')
export const CATALOG_SELECT_ITEM = action('CATALOG_SELECT_ITEM')
export const CATALOG_EXPAND_ITEM = action('CATALOG_EXPAND_ITEM')
export const CATALOG_SHOW_ITEM = action('CATALOG_SHOW_ITEM')
export const CATALOG_FILTER_TEXT = action('CATALOG_FILTER_TEXT')

export const setTree = (payload) => ({
  type: CATALOG_SET_TREE,
  payload,
})

export const getTree = () =>
  asyncAction.withNotification(async (dispatch, _, { catalogApi }) => dispatch(setTree(await catalogApi.getTree())))

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

export const showItem = (itemId) => ({
  type: CATALOG_SHOW_ITEM,
  itemId,
})
