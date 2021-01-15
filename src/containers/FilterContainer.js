import { connect } from 'react-redux'
import { SidebarFilterComponent } from '../components/Filter'
import { onChangeMilSymbolVisible, openMilSymbolModal, setSearchFilter } from '../store/actions/filter'
import { filterSearch, milSymbolFilters } from '../store/selectors'

const mapStateToProps = (state) => ({
  items: milSymbolFilters(state),
  search: filterSearch(state),
})

const mapDispatchToProps = {
  onSearch: setSearchFilter,
  onChangeVisible: onChangeMilSymbolVisible,
  onOpen: openMilSymbolModal,
}

const FilterContainer = connect(mapStateToProps, mapDispatchToProps)(SidebarFilterComponent)
export default FilterContainer
