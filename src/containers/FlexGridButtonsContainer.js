import { connect } from 'react-redux'
import FlexGridButtons from '../components/menu/FlexGridButtons'
import { canEditSelector, flexGridVisible } from '../store/selectors'
import * as flexGridActions from '../store/actions/flexGrid'
import { catchErrors } from '../store/actions/asyncAction'

const mapStateToProps = (store) => {
  const isEditMode = canEditSelector(store)
  const visible = flexGridVisible(store)
  return {
    isEditMode,
    visible,
  }
}

const mapDispatchToProps = {
  showFlexGridOptions: flexGridActions.showFlexGridOptions,
  hideFlexGrid: flexGridActions.hideFlexGrid,
}

const FlexGridButtonsContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps)
)(FlexGridButtons)

export default FlexGridButtonsContainer
