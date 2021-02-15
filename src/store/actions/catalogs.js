import { action } from '../../utils/services'
import { TOPOCODES } from '../../constants/TopoObj'
import { catalogs as catalogsConstants } from '../../constants'
import { getContactsInfo, getObjectsInfo } from '../selectors'
import { asyncAction } from './index'

export const CATALOG_SET_TOPOGRAPHIC_FIELDS = action('CATALOG_SET_TOPOGRAPHIC_FIELDS')
export const CATALOG_SET_TOPOGRAPHIC_BY_IDS = action('CATALOG_SET_TOPOGRAPHIC_BY_IDS')
export const CATALOG_SET_ATTRIBUTES = action('CATALOG_SET_ATTRIBUTES')
export const CATALOG_SET_ERRORS = action('CATALOG_SET_ERRORS')
export const CATALOG_SET_CONTACT_NAME = action('CATALOG_SET_CONTACT_NAME')

export const setTopographicObjectFields = (payload) => ({
  type: CATALOG_SET_TOPOGRAPHIC_FIELDS,
  payload,
})

export const setTopographicObjectByIds = (payload) => ({
  type: CATALOG_SET_TOPOGRAPHIC_BY_IDS,
  payload,
})

const setContactName = (payload) => ({
  type: CATALOG_SET_CONTACT_NAME,
  payload,
})

export const getTopographicObjectFields = () =>
  asyncAction.withNotification(async (dispatch, _, { catalogApi }) =>
    dispatch(setTopographicObjectFields(await catalogApi.getTopographicObjectFields(TOPOCODES))))

const loadContactName = (id) =>
  asyncAction.withNotification(async (dispatch, getState, { webmapApi: { getContactName } }) => {
    const state = getState()
    const contacts = getContactsInfo(state)
    if (!contacts[id]) {
      const response = await getContactName(id)
      response?.contactName && dispatch(setContactName({ [id]: response.contactName }))
    }
  })

export const loadCatalogContactsNames = (id) => asyncAction.withNotification(async (dispatch, getState) => {
  const state = getState()
  const objectsInfo = getObjectsInfo(state)
  const objectInfo = objectsInfo[id]
  objectInfo?.insertedById && await dispatch(loadContactName(objectInfo?.insertedById))
  objectInfo?.updatedById && await dispatch(loadContactName(objectInfo?.updatedById))
})

/**
 * @param payload {object | undefined}
 * @description set object or default empty object to errors catalogs
*/
export const setCatalogErrors = (payload) => ({
  type: CATALOG_SET_ERRORS,
  payload,
})

const setCatalogAttributes = (payload) => ({
  type: CATALOG_SET_ATTRIBUTES,
  payload,
})

export const getCatalogAttributesFields = (layer) =>
  asyncAction.withNotification(async (dispatch, getState, { catalogApi }) => {
    const state = getState()
    const isAttributesExistInState = Object.prototype.hasOwnProperty.call(state.catalogs.attributes, layer)
    if (isAttributesExistInState) {
      return true
    }
    const catalogId = catalogsConstants.catalogsCommonData[layer].catalog
    const catalogData = await catalogApi.getCatalogItemInfo(catalogId)
    dispatch(setCatalogAttributes({ name: layer, value: catalogData?.attributes ?? [] }))
  })
