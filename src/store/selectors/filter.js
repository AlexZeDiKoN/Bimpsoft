import { createSelector } from 'reselect'
import moment from 'moment'
import { model } from '@C4/MilSymbolEditor'
import { data } from '@C4/CommonComponents'
import { DATE_TIME_FORMAT } from '../../constants/formats'
import {
  CATALOG_FILTERS,
  MIL_SYMBOL_FILTER,
  SEARCH_FILTER,
  LOADING,
  SEARCH_TOPOGRAPHIC_FILTER,
  TOPOGRAPHIC_OBJECT_FILTER, LOADING_TOPOGRAPHIC_OBJECT,
} from '../../constants/filter'
import SelectionTypes from '../../constants/SelectionTypes'
import { isCatalogLayer } from '../../constants/catalogs'
import { objects } from './targeting'
import { selectedLayerId } from './layersSelector'
import { catalogsTopographicByIds } from './catalogs'

const { TextFilter } = data

const { APP6Code: {
  getAmplifier, getIcon,
  getModifier1,
  getModifier2,
  getSymbol,
  getStatus,
  getAffiliation,
  isHQ,
  isTaskForce,
  isDummy,
} } = model

const JSParser = (item) => item?.toJS ? item?.toJS() : item

const codeTypeCheck = [
  { func: getAmplifier, length: 2 },
  { func: getIcon, length: 6 },
  { func: getModifier1, length: 2 },
  { func: getModifier2, length: 2 },
  { func: getSymbol, length: 2 },
  { func: getStatus, length: 1 },
  { func: getAffiliation, length: 1 },
  { func: isHQ },
  { func: isTaskForce },
  { func: isDummy },
]

const compareByCode = (codeA, codeB, func, length = 0) =>
  func(codeA) === ''.padEnd(length, '0') || func(codeA) === func(codeB)

const compareByType = (aValue, bValue) => {
  const type = typeof aValue
  if (!aValue) {
    return true
  }
  if (moment.isMoment(aValue)) {
    return moment(aValue).format(DATE_TIME_FORMAT) === moment(bValue).format(DATE_TIME_FORMAT)
  }
  if (aValue?.lat && aValue?.lng) {
    return aValue?.lat === bValue?.lat && aValue?.lng === bValue?.lng
  }
  switch (type) {
    case 'string': return TextFilter.create(aValue).test(bValue)
    case 'number': return TextFilter.create(String(aValue)).test(String(bValue))
    default: return true
  }
}

const compareObjectValues = (object = {}, filterItem = {}, compareFn = compareByType) =>
  Object.entries(filterItem).every(([ key, value ]) => compareFn(value, object[key]))

const filterPointType = (filter, current) => {
  const { code: objectCode, level: objectLevel, point: objectPoint, attributes: objectAttributes, layer: objectLayer } = current
  const { code: filterCode, level: filterLevel, point: filterPoint, attributes: filterAttributes } = filter
  const [ jsObjectAttributes, jsFilterAttributes ] = [ JSParser(objectAttributes), JSParser(filterAttributes) ]
  const isCodeEqual = codeTypeCheck.every(({ func, length }) =>
    compareByCode(filterCode, objectCode, func, length))
  const isLevelEqual = compareByType(filterLevel, objectLevel)
  const isPointEqual = compareByType(filterPoint, objectPoint)
  const isAttributesEqual = compareObjectValues(jsObjectAttributes, jsFilterAttributes)
  const isCatalogAttributesEqual = isCatalogLayer(objectLayer)
    ? compareObjectValues(jsObjectAttributes.catalogAttributes, jsFilterAttributes.catalogAttributes)
    : true
  return isCodeEqual && isLevelEqual && isPointEqual && isAttributesEqual && isCatalogAttributesEqual
}
// ------------------------------------ selectors ---------------------------------------------------------------

export const catalogFilters = (state) => state.filter[CATALOG_FILTERS]
export const catalogsFields = (state) => state.catalogs.attributes
export const milSymbolFilters = (state) => state.filter[MIL_SYMBOL_FILTER]
export const filterSearch = (state) => state.filter[SEARCH_FILTER]
export const filterTopographicSearch = (state) => state.filter[SEARCH_TOPOGRAPHIC_FILTER]
export const loadingFiltersStatus = (state) => state.filter[LOADING]
export const topographicObjectsFilters = (state) => state.filter[TOPOGRAPHIC_OBJECT_FILTER]
export const loadingTopographicObjects = (state) => state.filter[LOADING_TOPOGRAPHIC_OBJECT]

export const getCurrentFilters = createSelector(milSymbolFilters, selectedLayerId, (filters, selectedLayer) => {
  return filters.filter(({ inCurrentLayer, data }) => inCurrentLayer ? data?.layer === selectedLayer : true)
})

export const getFilteredObjects = createSelector(getCurrentFilters, objects, (filters, objects = {}) => {
  const visibleFilters = filters.filter(({ visible }) => visible).map(({ data }) => (data))
  return objects.filter((item) =>
    item.type === SelectionTypes.POINT ? visibleFilters.every((filterItem) => filterPointType(filterItem, item)) : true,
  )
})

export const getFilteredObjectsCount = createSelector(objects, getCurrentFilters, (objectsMap = [], filters) => {
  const count = {}
  const points = objectsMap.filter((item) => item.type === SelectionTypes.POINT)
  filters.forEach(({ data, visible }, index) => {
    if (visible) {
      const filtered = points.filter((item) => filterPointType(data, item))
      count[index] = filtered?.size
    }
  })
  return count
})

export const getTopographicObjectsList = createSelector(catalogsTopographicByIds, topographicObjectsFilters,
  (byIds, filtersData) => {
    const shownFilters = Object.values(byIds).filter(({ shown }) => shown)
    return shownFilters.map(({ id }) => filtersData[id]?.objects ?? []).flat(1)
  })

export const getTopographicObjectsCount = createSelector(topographicObjectsFilters, (filtersData) => {
  return Object.fromEntries(Object.entries(filtersData).map(([ id, { objects } ]) => [ id, objects?.length ?? 0 ]))
})
