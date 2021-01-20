import { createSelector } from 'reselect'
import moment from 'moment'
import { model } from '@C4/MilSymbolEditor'
import { data } from '@C4/CommonComponents'
import { DATE_TIME_FORMAT } from '../../constants/formats'
import { CATALOG_FILTERS, MIL_SYMBOL_FILTER, SEARCH_FILTER, LOADING } from '../../constants/filter'
import SelectionTypes from '../../constants/SelectionTypes'
import { objects } from './targeting'
import { selectedLayerId } from './layersSelector'

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

// ------------------------------------ selectors ---------------------------------------------------------------

export const catalogFilters = (state) => state.filter[CATALOG_FILTERS]
export const catalogsFields = (state) => state.catalogs.attributes
export const getCatalogsByIds = (state) => state.catalogs.byIds
export const milSymbolFilters = (state) => state.filter[MIL_SYMBOL_FILTER]
export const filterSearch = (state) => state.filter[SEARCH_FILTER]
export const loadingFiltersStatus = (state) => state.filter[LOADING]

export const catalogObjects = (state) => state.catalogs.objects

export const getFilterStatusSelector = createSelector(catalogFilters, (filtered) => (id) => Boolean(filtered[id]))

export const getFilteredCatalogsObjects = createSelector(catalogFilters, catalogObjects, (filters, catalogs = {}) => {
  const filteredCatalogs = Object.entries(catalogs).map(([ catalogId, catalogData ]) => {
    const filteredCatalog = filters[catalogId]
      ? catalogData.filter((catalogItem) => compareObjectValues(catalogItem, filters[catalogId]))
      : catalogData
    return [ catalogId, filteredCatalog ]
  })
  return Object.fromEntries(filteredCatalogs)
})

export const getCurrentFilters = createSelector(milSymbolFilters, selectedLayerId, (filters, selectedLayer) => {
  return filters.filter(({ inCurrentLayer, data }) => inCurrentLayer ? data?.layer === selectedLayer : true)
})

export const getFilteredObjects = createSelector(getCurrentFilters, objects, (filters, objects = {}) => {
  const visibleFilters = filters.filter(({ visible }) => visible).map(({ data }) => (data))
  return objects.filter((item) => {
    return item.type === SelectionTypes.POINT
      ? visibleFilters.every((filterItem) => {
        const { code: objectCode, level: objectLevel, point: objectPoint, attributes: objectAttributes } = item
        const { code: filterCode, level: filterLevel, point: filterPoint, attributes: filterAttributes } = filterItem
        const isCodeEqual = codeTypeCheck.every(({ func, length }) =>
          compareByCode(filterCode, objectCode, func, length))
        const isLevelEqual = compareByType(filterLevel, objectLevel)
        const isPointEqual = compareByType(filterPoint, objectPoint)
        const isAttributesEqual = compareObjectValues(JSParser(objectAttributes), JSParser(filterAttributes))
        return isCodeEqual && isLevelEqual && isPointEqual && isAttributesEqual
      })
      : true
  })
})

export const getFilteredObjectsPoints = createSelector(getFilteredObjects, (filtered) => {
  return filtered.filter((item) => item.type === SelectionTypes.POINT)
})
