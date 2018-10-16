import { connect } from 'react-redux'
import LeftMenu from '../components/menu/LeftMenu'
import * as viewModesKeys from '../constants/viewModesKeys'
import * as viewModesActions from '../store/actions/viewModes'
import * as webMapActions from '../store/actions/webMap'
import * as selectionActions from '../store/actions/selection'
import { canEditSelector, canEditCurrentLayerSelector, layerNameSelector } from '../store/selectors'

const mapStateToProps = (store) => {
  const {
    viewModes: {
      [viewModesKeys.subordinationLevel]: isShowSubordinationLevel,
    },
    webMap: { subordinationLevel, isMeasureOn },
  } = store

  const layerName = layerNameSelector(store)
  const isEditMode = canEditSelector(store)
  const canEditCurrentLayer = canEditCurrentLayerSelector(store)
  return {
    isEditMode,
    canEditCurrentLayer,
    // isShowPoints,
    isShowSubordinationLevel,
    isMeasureOn,
    subordinationLevel,
    layerName,
  }
}
const mapDispatchToProps = {
  onClickEditMode: () => viewModesActions.viewModeToggle(viewModesKeys.edit),
  // onClickPointSign: () => (dispatch, getState) => {
  //   const {
  //     viewModes: { [viewModesKeys.pointSignsList]: isShowPoints },
  //     selection: { newShape },
  //   } = getState()
  //
  //   if (isShowPoints) {
  //     if (newShape && newShape.type !== SelectionTypes.POINT) {
  //       dispatch(selectionActions.setNewShape({ type: SelectionTypes.POINT }))
  //     } else {
  //       dispatch(viewModesActions.viewModeDisable(viewModesKeys.pointSignsList))
  //       dispatch(selectionActions.setNewShape({}))
  //     }
  //   } else {
  //     dispatch(selectionActions.setNewShape({ type: SelectionTypes.POINT }))
  //     dispatch(viewModesActions.viewModeToggle(viewModesKeys.pointSignsList))
  //   }
  // },
  onClickSubordinationLevel: () => viewModesActions.viewModeToggle(viewModesKeys.subordinationLevel),
  onMeasureChange: (isMeasureOn) => webMapActions.setMeasure(isMeasureOn),
  onCut: selectionActions.cut,
  onCopy: selectionActions.copy,
  onPaste: selectionActions.paste,
  onDelete: selectionActions.showDeleteForm,
  onSubordinationLevelClose: () => viewModesActions.viewModeDisable(viewModesKeys.subordinationLevel),
  onSubordinationLevelChange: (subordinationLevel) => (dispatch) => {
    dispatch(webMapActions.setSubordinationLevel(subordinationLevel))
    dispatch(viewModesActions.viewModeDisable(viewModesKeys.subordinationLevel))
  },
}
const LeftMenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftMenu)

export default LeftMenuContainer
