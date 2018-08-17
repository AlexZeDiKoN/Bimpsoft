import { connect } from 'react-redux'
import LeftMenu from '../components/menu/LeftMenu'
import * as viewModesKeys from '../constants/viewModesKeys'
import * as viewModesActions from '../store/actions/viewModes'
import * as webMapActions from '../store/actions/webMap'
import * as selectionActions from '../store/actions/selection'
import SelectionTypes from '../constants/SelectionTypes'

const mapStateToProps = (store) => {
  const {
    viewModes: {
      [viewModesKeys.edit]: isEditMode,
      [viewModesKeys.pointSignsList]: isShowPoints,
      [viewModesKeys.mapSourcesList]: isShowSources,
      [viewModesKeys.lineSignsList]: isShowLines,
      [viewModesKeys.subordinationLevel]: isShowSubordinationLevel,
    },
    selection: { newShape },
    webMap: { subordinationLevel },
  } = store
  return {
    isEditMode,
    isShowPoints,
    isShowSources,
    isShowLines,
    isShowSubordinationLevel,
    newShape,
    subordinationLevel,
  }
}
const mapDispatchToProps = {
  onClickEditMode: () => viewModesActions.viewModeToggle(viewModesKeys.edit),
  onClickPointSign: () => (dispatch, getState) => {
    const {
      viewModes: { [viewModesKeys.pointSignsList]: isShowPoints },
      selection: { newShape },
    } = getState()

    if (isShowPoints) {
      if (newShape && newShape.type !== SelectionTypes.POINT) {
        dispatch(selectionActions.setNewShape({ type: SelectionTypes.POINT }))
      } else {
        dispatch(viewModesActions.viewModeDisable(viewModesKeys.pointSignsList))
        dispatch(selectionActions.setNewShape({}))
      }
    } else {
      dispatch(selectionActions.setNewShape({ type: SelectionTypes.POINT }))
      dispatch(viewModesActions.viewModeToggle(viewModesKeys.pointSignsList))
    }
  },
  onClickMapSource: () => viewModesActions.viewModeToggle(viewModesKeys.mapSourcesList),
  onClickLineSign: () => viewModesActions.viewModeToggle(viewModesKeys.lineSignsList),
  onLinesListClose: () => viewModesActions.viewModeDisable(viewModesKeys.lineSignsList),
  onClickSubordinationLevel: () => viewModesActions.viewModeToggle(viewModesKeys.subordinationLevel),
  onSubordinationLevelClose: () => viewModesActions.viewModeDisable(viewModesKeys.subordinationLevel),
  onNewShapeChange: (newShape) => selectionActions.setNewShape(newShape),
  onSubordinationLevelChange: (subordinationLevel) => (dispatch) => {
    dispatch(webMapActions.setSubordinationLevel(subordinationLevel))
    dispatch(viewModesActions.viewModeDisable(viewModesKeys.subordinationLevel))
  },
  tempClickOnMap: () => selectionActions.setNewShapeCoordinates({ x: '1111', y: '2222' }),
  tempFinishClickOnMap: () => selectionActions.showCreateForm,
}
const LeftMenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftMenu)

export default LeftMenuContainer
