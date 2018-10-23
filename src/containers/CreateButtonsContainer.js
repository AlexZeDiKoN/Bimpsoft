import { connect } from 'react-redux'
import CreateButtons from '../components/menu/CreateButtons'
import * as viewModesKeys from '../constants/viewModesKeys'
import * as viewModesActions from '../store/actions/viewModes'
import * as selectionActions from '../store/actions/selection'
import { canEditSelector } from '../store/selectors'

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
  }
}
const mapDispatchToProps = {
  onClickLineSign: () => viewModesActions.viewModeToggle(viewModesKeys.lineSignsList),
  onLinesListClose: () => viewModesActions.viewModeDisable(viewModesKeys.lineSignsList),
  onNewShapeChange: (newShape) => selectionActions.setNewShape(newShape),
}
const CreateButtonsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateButtons)

export default CreateButtonsContainer
