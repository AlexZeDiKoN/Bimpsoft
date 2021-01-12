import { createSelector } from 'reselect'
import moment from 'moment'
import { DATE_TIME_FORMAT } from '../../constants/formats'

export const catalogFilters = (state) => state.filter.catalogFilters
export const catalogsFields = (state) => state.filter.catalogsFields

export const catalogObjects = (state) => state.catalogs.objects

const compareByType = (aValue, bValue) => {
  const type = typeof aValue
  if (moment.isMoment(aValue)) {
    return moment(aValue).format(DATE_TIME_FORMAT) === moment(bValue).format(DATE_TIME_FORMAT)
  }
  if (aValue?.lat && aValue?.lng) {
    return aValue?.lat === bValue?.lat && aValue?.lng === bValue?.lng
  }
  switch (type) {
    case 'string': return String(aValue).toLocaleLowerCase() === String(bValue).toLocaleLowerCase()
    case 'number': return aValue === bValue
    default: return JSON.stringify(aValue) === JSON.stringify(bValue)
  }
}

export const getFilterStatusSelector = createSelector(catalogFilters, (filtered) => (id) => Boolean(filtered[id]))

export const getFilteredCatalogsObjects = createSelector(catalogFilters, catalogObjects, (filters, catalogs = {}) => {
  const filteredCatalogs = Object.entries(catalogs).map(([ catalogId, catalogData ]) => {
    if (!filters[catalogId]) {
      return [ catalogId, catalogData ] // if catalog item not in filterList
    }
    const filterData = Object.entries(filters[catalogId] ?? {})
    const filteredCatalog = catalogData.filter((catalogItem) => {
      return filterData.every(([ filterKey, filterValue ]) => compareByType(filterValue, catalogItem[filterKey]))
    })
    return [ catalogId, filteredCatalog ]
  })
  return Object.fromEntries(filteredCatalogs)
})
