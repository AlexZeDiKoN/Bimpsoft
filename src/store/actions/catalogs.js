import { action } from '../../utils/services'
import { TOPOCODES } from '../../constants/TopoObj'
import { getCatalogMeta, getCatalogMetaLayers, catalogsTopographicPreview, getContactsInfo, getObjectsInfo } from '../selectors'
import { asyncAction, maps } from './index'

export const CATALOG_SET_TOPOGRAPHIC_FIELDS = action('CATALOG_SET_TOPOGRAPHIC_FIELDS')
export const CATALOG_SET_TOPOGRAPHIC_BY_IDS = action('CATALOG_SET_TOPOGRAPHIC_BY_IDS')
export const CATALOG_SET_ATTRIBUTES = action('CATALOG_SET_ATTRIBUTES')
export const CATALOG_SET_ERRORS = action('CATALOG_SET_ERRORS')
export const CATALOG_SET_CONTACT_NAME = action('CATALOG_SET_CONTACT_NAME')
export const CATALOG_SET_META = action('CATALOG_SET_META')
export const CATALOG_TOGGLE_EXPAND_TOPOGRAPHIC = action('CATALOG_TOGGLE_EXPAND_TOPOGRAPHIC')
export const CATALOG_SET_TOPOGRAPHIC_PREVIEW = action('CATALOG_SET_TOPOGRAPHIC_PREVIEW')

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

export const onExpandTopographicItem = (id, status) => ({
  type: CATALOG_TOGGLE_EXPAND_TOPOGRAPHIC,
  payload: { id, status },
})

export const onPreviewTopographicItem = (add, remove) => (dispatch, getState) => {
  const previewList = [ ...catalogsTopographicPreview(getState()) ]
  const isArrayRemove = Array.isArray(remove)
  const payload = (add ? previewList.concat(add) : previewList)
    .filter((item) => isArrayRemove ? !remove.includes(item) : item !== remove)
  dispatch({ type: CATALOG_SET_TOPOGRAPHIC_PREVIEW, payload })
}

export const loadCatalogsMetaIfNotExist = () =>
  asyncAction.withNotification(async (dispatch, getState, { catalogApi }) => {
    const catalogMeta = getCatalogMeta(getState())
    if (!Object.values(catalogMeta.layers).length && !catalogMeta.mapId) { // if not loaded check
      const payload = await catalogApi.getCatalogMeta()
      dispatch({ type: CATALOG_SET_META, payload })
    }
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
    const catalogId = getCatalogMetaLayers(state)[layer]?.catalog
    const catalogData = await catalogApi.getCatalogItemInfo(catalogId)
    dispatch(setCatalogAttributes({ name: layer, value: catalogData?.attributes ?? [] }))
  })

export const loadCatalogsMap = () => asyncAction.withNotification(async (dispatch, getState) => {
  await dispatch(loadCatalogsMetaIfNotExist())
  const catalogMeta = getCatalogMeta(getState())
  await dispatch(maps.openMapFolder(catalogMeta.mapId))
})
