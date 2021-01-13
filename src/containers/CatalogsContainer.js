import { connect } from 'react-redux'
import CatalogsComponent from '../components/Catalogs'
import { catalogs, filter } from '../store/actions'
import { getFilterStatusSelector } from '../store/selectors'
import { catchErrors } from '../store/actions/asyncAction'

const mapStateToProps = ({ catalogs, ...state }) => ({
  ...catalogs,
  shownIds: Object.keys(catalogs.objects).reduce((res, key) => ({ [key]: true, ...res }), {}),
  getFilterStatus: getFilterStatusSelector(state),
})

const mapDispatchToProps = {
  onExpand: catalogs.expandItem,
  onShow: catalogs.getList,
  onHide: catalogs.dropList,
  onFilterTextChange: catalogs.setFilterText,
  onFilterClick: filter.setModalCatalogFilter,
  onClick: catalogs.setSelectedId,
  preloadCatalogList: catalogs.getTree,
}

const CatalogsContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps),
)(CatalogsComponent)

export default CatalogsContainer
