import { connect } from 'react-redux'
import { PointsFilterComponent } from '../components/Filter/Sidebar'
import { onChangeMilSymbolVisible, openMilSymbolModal, setSearchFilter } from '../store/actions/filter'
import {
  filterSearch,
  getCurrentFilters,
  getFilteredObjectsCount,
  mapCOP,
  selectedLayerId,
  isCatalogLayerFunc,
} from '../store/selectors'
import { setModalData } from '../store/actions/task'
import { CREATE_NEW_LAYER_TYPE } from '../constants/modals'

const openModalCreateLayer = setModalData.bind(null, { type: CREATE_NEW_LAYER_TYPE })

const mapStateToProps = (state) => {
  const items = getCurrentFilters(state)
  const selectedLayer = selectedLayerId(state)
  return {
    items,
    search: filterSearch(state),
    isCOP: mapCOP(state),
    isCatalogLayer: isCatalogLayerFunc(state)(selectedLayer),
    filtersCount: getFilteredObjectsCount(state),
    isSaveActive: Boolean(items.length),
  }
}

const mapDispatchToProps = {
  onSearch: setSearchFilter,
  onChangeVisible: onChangeMilSymbolVisible,
  onOpen: openMilSymbolModal,
  onOpenCreateLayer: openModalCreateLayer,
}

const FilterContainer = connect(mapStateToProps, mapDispatchToProps)(PointsFilterComponent)
export default FilterContainer
