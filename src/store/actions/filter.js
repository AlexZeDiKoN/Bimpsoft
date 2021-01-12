import { action } from '../../utils/services'
import { CATALOG_FILTER_TYPE } from '../../constants/modals'
import { setModalData } from './task'
import { asyncAction } from './index'

export const SET_FILTER_CATALOG = action('SET_FILTER_CATALOG')
export const REMOVE_FILTER_CATALOG = action('REMOVE_FILTER_CATALOG')
export const SET_CATALOGS_FIELDS = action('SET_CATALOGS_FIELDS')

export const setFilter = (type, payload) => ({ type, payload })

export const removeFilterCatalog = setFilter.bind(null, REMOVE_FILTER_CATALOG)

export const setCatalogFields = setFilter.bind(null, SET_CATALOGS_FIELDS)

export const setFilterCatalog = setFilter.bind(null, SET_FILTER_CATALOG)

export const setModalCatalogFilter = (id) => asyncAction.withNotification(
  async (dispatch, getState, { catalogApi }) => {
    const state = getState()
    if (!state.filter.catalogsFields[id]) {
      const catalogFields = await catalogApi.getCatalogItemInfo(id)
      dispatch(setCatalogFields({ [id]: catalogFields }))
    }
    dispatch(setModalData({ type: CATALOG_FILTER_TYPE, id }))
  })
