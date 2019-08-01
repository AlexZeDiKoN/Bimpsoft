import { action } from '../../utils/services'

export const TARGET_CATALOG_FILTER_TEXT = action('TARGET_CATALOG_FILTER_TEXT')

export const setFilterText = (filterText) => ({
  type: TARGET_CATALOG_FILTER_TEXT,
  filterText,
})
