import { connect } from 'react-redux'
import CatalogsComponent from '../components/CatalogsComponent'
import { catalogs } from '../store/actions'
import { catchErrors } from '../store/actions/asyncAction'

const mapStateToProps = (store) => store.catalogs

const mapDispatchToProps = {
  onExpand: catalogs.expandItem,
  onFilterTextChange: catalogs.setFilterText,
  onClick: catalogs.setSelectedId,
}

const CatalogsContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps)
)(CatalogsComponent)

export default CatalogsContainer
