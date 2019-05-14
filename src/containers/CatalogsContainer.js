import { connect } from 'react-redux'
import CatalogsComponent from '../components/CatalogsComponent'
import { catalogs } from '../store/actions'
import { catchErrors } from '../store/actions/asyncAction'

const mapStateToProps = ({ catalogs }) => ({
  ...catalogs,
  shownIds: Object.keys(catalogs.objects).reduce((res, key) => ({ [key]: true, ...res }), {}),
})

const mapDispatchToProps = {
  onExpand: catalogs.expandItem,
  onShow: catalogs.getList,
  onHide: catalogs.dropList,
  onFilterTextChange: catalogs.setFilterText,
  onClick: catalogs.setSelectedId,
  preloadCatalogList: catalogs.getTree,
}

const CatalogsContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps)
)(CatalogsComponent)

export default CatalogsContainer
