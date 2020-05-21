import { connect } from 'react-redux'
import CreateButtons from '../components/menu/CreateButtons'
import * as viewModesKeys from '../constants/viewModesKeys'
import * as viewModesActions from '../store/actions/viewModes'
import * as webmapActions from '../store/actions/webMap'
import * as selectionActions from '../store/actions/selection'
import { canEditSelector, undoInfo } from '../store/selectors'
import { catchErrors } from '../store/actions/asyncAction'

const mapStateToProps = (store) => {
  const {
    viewModes: { [viewModesKeys.lineSignsList]: isShowLines },
    selection: { newShape },
  } = store

  const isEditMode = canEditSelector(store)
  return {
    isEditMode,
    isShowLines,
    newShape,
    undoInfo: undoInfo(store),
  }
}
const mapDispatchToProps = {
  onClickLineSign: () => viewModesActions.viewModeToggle(viewModesKeys.lineSignsList),
  onLinesListClose: () => viewModesActions.viewModeDisable(viewModesKeys.lineSignsList),
  onNewShapeChange: (newShape) => selectionActions.setNewShape(newShape),
  undo: webmapActions.undo,
  redo: webmapActions.redo,
}
const CreateButtonsContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps)
)(CreateButtons)

export default CreateButtonsContainer
