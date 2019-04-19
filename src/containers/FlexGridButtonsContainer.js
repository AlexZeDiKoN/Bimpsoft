import { connect } from 'react-redux'
import FlexGridButtons from '../components/menu/FlexGridButtons'
import { canEditSelector, flexGridData, flexGridVisible } from '../store/selectors'
import * as flexGridActions from '../store/actions/flexGrid'
import * as selectionActions from '../store/actions/selection'
import * as webMapActions from '../store/actions/webMap'
import { catchErrors } from '../store/actions/asyncAction'
import * as FormTypes from '../constants/FormTypes'

// @TODO: FIND NECESSARY ACTIONS & PROPS
// @TODO: delete excess
const mapStateToProps = (store) => {
  const { selection: { showForm } } = store
  return {
    isEditMode: canEditSelector(store),
    visible: flexGridVisible(store),
    isShownDivideForm: showForm === FormTypes.DIVIDE_DIR,
    flexGrid: flexGridData(store),
  }
}

const mapDispatchToProps = {
  showFlexGridOptions: flexGridActions.showFlexGridOptions,
  hideFlexGrid: flexGridActions.hideFlexGrid,
  calcFlexGridUnits: flexGridActions.calcUnits,
  // @TODO: connect action
  showDivideDirForm: selectionActions.showDivideForm,
  onModalCancel: selectionActions.hideForm,
  selectDirection: flexGridActions.selectDirection,
  deselectDirection: flexGridActions.deselectDirection,
  // @TODO: delete:
  updateGeometry: webMapActions.updateObjectGeometry,
  updateAttributes: webMapActions.updateObjectAttributes,
}

const FlexGridButtonsContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps)
)(FlexGridButtons)

export default FlexGridButtonsContainer
