import { createSelector, defaultMemoize } from 'reselect'
import { catalogs as catalogsConstants } from '../../constants'
import { objectHas } from '../../utils/helpers'
import { selectedLayerId } from './layersSelector'
import { mapsByIds } from './maps'
import { getObjectPreview } from './selection'
import { getObjectsInfo } from './objects'

const DEFAULT_ARRAY = Object.freeze([])
const DEFAULT_OBJECT = Object.freeze({})

export const catalogsTopographicByIds = (state) => state.catalogs.topographicObjectsData.byIds
export const catalogsTopographicRoots = (state) => state.catalogs.topographicObjectsData.roots
export const catalogsAttributes = (state) => state.catalogs.attributes
export const catalogErrors = (state) => state.catalogs.errors
export const getContactsInfo = (state) => state.catalogs.contacts

export const catalogCurrentLayerAttributesFields = createSelector(catalogsAttributes, selectedLayerId,
  (attributes, currentId) => catalogsConstants.isCatalogLayer(currentId)
    ? attributes[currentId]
    : DEFAULT_ARRAY,
)

export const catalogAttributesFieldsById = defaultMemoize((currentId) => createSelector(catalogsAttributes,
  (attributes) => catalogsConstants.isCatalogLayer(currentId)
    ? attributes[currentId]
    : DEFAULT_ARRAY,
))

export const isMapIncludesCatalogs = createSelector(mapsByIds,
  (byIds) => objectHas(byIds, catalogsConstants.catalogMapId),
)

export const catalogsAdditionalInfo = createSelector(getObjectPreview, getObjectsInfo, getContactsInfo,
  (preview, objectsInfo, contacts) => {
    const objectInfo = objectsInfo[preview?.id]
    return objectInfo
      ? {
        [catalogsConstants.commonAttributeKeys.CREATE_DATE]: objectInfo.inserted,
        [catalogsConstants.commonAttributeKeys.CHANGE_DATE]: objectInfo.updated,
        [catalogsConstants.commonAttributeKeys.CHANGED_BY]: contacts[objectInfo.updatedById],
        [catalogsConstants.commonAttributeKeys.CREATED_BY]: contacts[objectInfo.insertedById],
      }
      : DEFAULT_OBJECT
  })
