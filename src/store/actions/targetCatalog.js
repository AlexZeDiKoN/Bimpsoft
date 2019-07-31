import { action } from '../../utils/services'

export const TARGET_CATALOG_SHOW_ITEM = action('TARGET_CATALOG_SHOW_ITEM')
export const TARGET_CATALOG_HIDE_ITEM = action('TARGET_CATALOG_HIDE_ITEM')
export const TARGET_CATALOG_SELECT_ITEM = action('TARGET_CATALOG_SELECT_ITEM')
export const TARGET_CATALOG_FILTER_TEXT = action('TARGET_CATALOG_FILTER_TEXT')

export const show = (objectId) => ({
  type: TARGET_CATALOG_SHOW_ITEM,
  payload: { objectId },
})
export const hide = (objectId) => ({
  type: TARGET_CATALOG_HIDE_ITEM,
  payload: { objectId },
})

export const setFilterText = (filterText) => ({
  type: TARGET_CATALOG_FILTER_TEXT,
  filterText,
})
