import { connect } from 'react-redux'
import CatalogsComponent from '../components/Catalogs'
import { catalogs, filter } from '../store/actions'
import { getFilteredCatalogsCount, getFilterStatusSelector } from '../store/selectors'
import { catchErrors } from '../store/actions/asyncAction'

const mapStateToProps = (state) => {
  const { catalogs } = state
  return ({
    ...catalogs,
    shownIds: Object.keys(catalogs.objects).reduce((res, key) => ({ [key]: true, ...res }), {}),
    getFilterStatus: getFilterStatusSelector(state),
    filterCount: getFilteredCatalogsCount(state),
  })
}

const mapDispatchToProps = {
  onExpand: catalogs.expandItem,
  onShow: catalogs.getList,
  onHide: catalogs.dropList,
  onFilterTextChange: catalogs.setFilterText,
  onFilterClick: filter.openModalCatalogFilter,
  onClick: catalogs.setSelectedId,
  preloadCatalogList: catalogs.getTree,
}

const CatalogsContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps),
)(CatalogsComponent)

export default CatalogsContainer
