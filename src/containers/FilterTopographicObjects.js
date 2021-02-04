import { connect } from 'react-redux'
import { TopographicObjectsFilterComponent } from '../components/Filter/Sidebar'
import {
  setSearchTopographicFilter,
  onChangeVisibleTopographicObject,
  openModalTopographicFilter,
} from '../store/actions/filter'
import {
  filterTopographicSearch,
  catalogsTopographicByIds,
  catalogsTopographicRoots,
  topographicObjectsFilters,
  getTopographicObjectsCount,
} from '../store/selectors'
import { getTopographicObjectFields } from '../store/actions/catalogs'

const mapStateToProps = (state) => ({
  search: filterTopographicSearch(state),
  roots: catalogsTopographicRoots(state),
  byIds: catalogsTopographicByIds(state),
  filterCount: getTopographicObjectsCount(state),
  activeFilters: topographicObjectsFilters(state),
})

const mapDispatchToProps = {
  onSearch: setSearchTopographicFilter,
  onChangeVisible: onChangeVisibleTopographicObject,
  onFilterClick: openModalTopographicFilter,
  preloadFields: getTopographicObjectFields,
}

const FilterTopographicObjects = connect(mapStateToProps, mapDispatchToProps)(TopographicObjectsFilterComponent)
export default FilterTopographicObjects
