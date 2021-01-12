import { action } from '../../utils/services'
import { CATALOG_FILTER_TYPE } from '../../constants/modals'
import { setModalData } from './task'
import { asyncAction } from './index'

export const SET_FILTER_CATALOG = action('SET_FILTER_CATALOG')
export const REMOVE_FILTER_CATALOG = action('REMOVE_FILTER_CATALOG')
export const SET_CATALOGS_FIELDS = action('SET_CATALOGS_FIELDS')

export const removeFilterCatalog = (payload) => ({ type: REMOVE_FILTER_CATALOG, payload })

export const setCatalogFields = (payload) => ({ type: SET_CATALOGS_FIELDS, payload })

export const setFilterCatalog = (payload) => ({ type: SET_FILTER_CATALOG, payload })

export const setModalCatalogFilter = (id) => asyncAction.withNotification(
  async (dispatch, getState, { catalogApi }) => {
    const state = getState()
    if (!state.filter.catalogsFields[id]) {
      const catalogFields = await catalogApi.getCatalogItemInfo(id)
      dispatch(setCatalogFields({ [id]: catalogFields }))
    }
    dispatch(setModalData({ type: CATALOG_FILTER_TYPE, id }))
  })
