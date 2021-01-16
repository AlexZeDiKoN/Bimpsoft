import { connect } from 'react-redux'
import { SidebarFilterComponent } from '../components/Filter'
import { onChangeMilSymbolVisible, openMilSymbolModal, setSearchFilter } from '../store/actions/filter'
import { filterSearch, getFilteredObjectsPoints, mapCOP, milSymbolFilters } from '../store/selectors'
import { setModalData } from '../store/actions/task'
import { CREATE_NEW_LAYER_TYPE } from '../constants/modals'

const openModalCreateLayer = setModalData.bind(null, { type: CREATE_NEW_LAYER_TYPE })

const mapStateToProps = (state) => ({
  items: milSymbolFilters(state),
  search: filterSearch(state),
  isCOP: mapCOP(state),
  isSaveActive: Boolean(
    getFilteredObjectsPoints(state)?.size &&
    milSymbolFilters(state).length,
  ),
})

const mapDispatchToProps = {
  onSearch: setSearchFilter,
  onChangeVisible: onChangeMilSymbolVisible,
  onOpen: openMilSymbolModal,
  onOpenCreateLayer: openModalCreateLayer,
}

const FilterContainer = connect(mapStateToProps, mapDispatchToProps)(SidebarFilterComponent)
export default FilterContainer
