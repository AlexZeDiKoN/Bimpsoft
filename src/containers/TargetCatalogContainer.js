import { connect } from 'react-redux'
import TargetCatalog from '../components/TargetCatalog'
import { selection, targetCatalog } from '../store/actions'
import { catchErrors } from '../store/actions/asyncAction'
import { targetObjects } from '../store/selectors'
import { MilSymbol } from '@DZVIN/MilSymbolEditor'
import React from 'react'

// const mapStateToProps = ({ webMap }) => ({
//   ...webMap,
//   shownIds: Object.keys(webMap.objects).reduce((res, key) => ({ [key]: true, ...res }), {}),
// })
const mapStateToProps = (state) => {
  return {
    // ...catalogs,
    byIds: targetObjects(state),
    selectedList: state.selection.list,
  }
}

const mapDispatchToProps = {
  onFilterTextChange: targetCatalog.setFilterText,
  selectedList: selection.selectedList,
}

const TargetCatalogContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps),
)(TargetCatalog)

export default TargetCatalogContainer
