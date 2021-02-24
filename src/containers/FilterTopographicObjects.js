import { connect } from 'react-redux'
import { TopographicObjectsFilterComponent } from '../components/Filter/Sidebar'
import {
  setSearchTopographicFilter,
  onClickVisibleTopographicObject,
  openModalTopographicFilter,
} from '../store/actions/filter'
import {
  filterTopographicSearch,
  topographicObjectsFilters,
  getTopographicObjectsCount,
  loadingTopographicObjects,
  getTopographicCatalogTree,
  catalogsTopographicExpandedKeys,
} from '../store/selectors'
import {
  getTopographicObjectFields,
  onExpandTopographicItem,
  onPreviewTopographicItem,
} from '../store/actions/catalogs'
import { toggleCatalogModal } from '../store/actions/webMap'

const mapStateToProps = (state) => ({
  search: filterTopographicSearch(state),
  ...getTopographicCatalogTree(state),
  expandedKeys: catalogsTopographicExpandedKeys(state),
  filterCount: getTopographicObjectsCount(state),
  activeFilters: topographicObjectsFilters(state),
  loadingObjects: loadingTopographicObjects(state),
})

const mapDispatchToProps = {
  onSearch: setSearchTopographicFilter,
  onChangeVisible: onClickVisibleTopographicObject,
  onFilterClick: openModalTopographicFilter,
  preloadFields: getTopographicObjectFields,
  onExpand: onExpandTopographicItem,
  onPreview: onPreviewTopographicItem,
  onOpenModal: toggleCatalogModal,
}

const FilterTopographicObjects = connect(mapStateToProps, mapDispatchToProps)(TopographicObjectsFilterComponent)
export default FilterTopographicObjects
