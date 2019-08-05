import { connect } from 'react-redux'
import TargetCatalog from '../components/TargetCatalog'
import { selection, targetCatalog, webMap } from '../store/actions'
import { catchErrors } from '../store/actions/asyncAction'
import { targetObjects } from '../store/selectors'

const mapStateToProps = (state) => ({
  byIds: targetObjects(state),
  selectedList: state.selection.list,
  textFilter: state.targetCatalog.textFilter,
})

const mapDispatchToProps = {
  setFilterText: targetCatalog.setFilterText,
  setSelectedList: selection.selectedList,
  setScaleToSelection: webMap.setScaleToSelection,
}

const TargetCatalogContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps),
)(TargetCatalog)

export default TargetCatalogContainer
