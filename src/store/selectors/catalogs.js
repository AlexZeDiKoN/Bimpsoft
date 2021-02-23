import { createSelector, defaultMemoize } from 'reselect'
import { data } from '@C4/CommonComponents'
import { catalogs as catalogsConstants } from '../../constants'
import { objectHas, sortByIds, sortRoots } from '../../utils/helpers'
import { selectors } from '../../utils'
import { TOPOGRAPHIC_OBJECT_FILTER } from '../../constants/filter'
import { getChildrenName as getTopographicItemName } from '../../components/Filter/Sidebar/TopographicItem'
import { selectedLayerId } from './layersSelector'
import { mapsByIds } from './maps'
import { getObjectPreview } from './selection'
import { getObjectsInfo } from './objects'

const DEFAULT_ARRAY = Object.freeze([])
const DEFAULT_OBJECT = Object.freeze({})

const { getNormilizeTree } = data

const getAttributes = (isCatalogLayerFunc, currentId, attributes) =>
  isCatalogLayerFunc(currentId) ? attributes[currentId] : DEFAULT_ARRAY

export const catalogsTopographicByIds = (state) => state.catalogs.topographicObjectsData.byIds
export const catalogsTopographicExpandedKeys = (state) => state.catalogs.topographicObjectsData.expandedKeys
export const catalogsTopographicPreview = (state) => state.catalogs.topographicPreview
export const catalogsAttributes = (state) => state.catalogs.attributes
export const catalogErrors = (state) => state.catalogs.errors
export const getContactsInfo = (state) => state.catalogs.contacts
export const getCatalogMeta = (state) => state.catalogs.catalogMeta
export const getCatalogMetaLayers = (state) => state.catalogs.catalogMeta.layers

export const isCatalogLayerFunc = createSelector(getCatalogMeta, ({ layers }) =>
  (layerId) => objectHas(layers, layerId))

export const isCatalogMapFunc = createSelector(getCatalogMeta, ({ mapId }) => (currentId) => mapId === currentId)

export const getTopographicCatalogTree = createSelector(
  catalogsTopographicByIds,
  (state) => state.filter[TOPOGRAPHIC_OBJECT_FILTER],
  (byIds, topographicItems) => {
    const objects = Object.entries(topographicItems)
      .map(([ parentId, { objects = [] } ]) => objects.map((item) => ({ ...item, parentId })))
      .flat(1)
    const treeData = getNormilizeTree([ ...Object.values(byIds), ...objects ], selectors.getId, selectors.getParentId)
    sortByIds(treeData.byIds, getTopographicItemName)
    sortRoots(treeData.roots, treeData.byIds, selectors.getStringName)
    return treeData
  })

export const catalogCurrentLayerAttributesFields = createSelector(
  catalogsAttributes,
  selectedLayerId,
  isCatalogLayerFunc,
  (attributes, currentId, isCatalogLayerFunc) => getAttributes(isCatalogLayerFunc, currentId, attributes),
)

export const catalogAttributesFieldsById = defaultMemoize((currentId) => createSelector(
  catalogsAttributes,
  isCatalogLayerFunc,
  (attributes, isCatalogLayerFunc) => getAttributes(isCatalogLayerFunc, currentId, attributes),
))

export const isMapIncludesCatalogs = createSelector(mapsByIds, getCatalogMeta,
  (byIds, { mapId }) => objectHas(byIds, mapId))

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
