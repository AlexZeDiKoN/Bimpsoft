import { connect } from 'react-redux'
import TargetCatalog from '../components/TargetCatalog'
import { selection, targetCatalog } from '../store/actions'
import { catchErrors } from '../store/actions/asyncAction'
import { targetObjects } from '../store/selectors'

const mapStateToProps = (state) => {
  return {
    byIds: targetObjects(state),
    selectedList: state.selection.list,
    textFilter: state.targetCatalog.textFilter,
  }
}

const mapDispatchToProps = {
  setFilterText: targetCatalog.setFilterText,
  selectedList: selection.selectedList,
}

const TargetCatalogContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps),
)(TargetCatalog)

export default TargetCatalogContainer
