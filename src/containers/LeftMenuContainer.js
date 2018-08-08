import { connect } from 'react-redux'
import LeftMenu from '../components/menu/LeftMenu'
import * as viewModesKeys from '../constants/viewModesKeys'
import * as viewModesActions from '../store/actions/viewModes'
import * as webMapActions from '../store/actions/webMap'
import * as selectionActions from '../store/actions/selection'

const mapStateToProps = (store) => {
  const {
    viewModes: {
      [viewModesKeys.edit]: isEditMode,
      [viewModesKeys.pointSignsList]: isShowPoints,
      [viewModesKeys.mapSourcesList]: isShowSources,
    },
    selection: { newShape },
    webMap: { subordinationLevel },
  } = store
  return {
    isEditMode,
    isShowPoints,
    isShowSources,
    newShape,
    subordinationLevel,
  }
}
const mapDispatchToProps = (dispatch) => ({
  onClickEditMode: () => {
    dispatch(viewModesActions.viewModeToggle(viewModesKeys.edit))
  },
  onClickPointSign: () => {
    dispatch(viewModesActions.viewModeToggle(viewModesKeys.pointSignsList))
  },
  onClickMapSource: () => {
    dispatch(viewModesActions.viewModeToggle(viewModesKeys.mapSourcesList))
  },
  onNewShapeChange: (newShape) => {
    dispatch(selectionActions.setNewShape(newShape))
  },
  onSubordinationLevelChange: (subordinationLevel) => {
    dispatch(webMapActions.setSubordinationLevel(subordinationLevel))
  },
  tempClickOnMap: () => {
    dispatch(selectionActions.setNewShapeCoordinates({ x: 'x1111', y: 'y2222' }))
  },
  tempFinishClickOnMap: () => {
    dispatch(selectionActions.showCreateForm())
  },
})
const LeftMenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftMenu)

export default LeftMenuContainer
