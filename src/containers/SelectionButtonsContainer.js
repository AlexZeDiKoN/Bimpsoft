import { connect } from 'react-redux'
import SelectionButtons from '../components/menu/SelectionButtons'
import { FormTypes } from '../constants'
import { canEditSelector, layerNameSelector, selectedTypes, selectedPoints } from '../store/selectors'
import { selection as selectionActions, groups as groupsActions } from '../store/actions'
import { catchErrors } from '../store/actions/asyncAction'

const mapStateToProps = (store) => {
  const {
    selection: {
      showForm,
      list,
      clipboard,
    },
  } = store

  return {
    isEditMode: canEditSelector(store),
    layerName: layerNameSelector(store),
    showDelForm: showForm === FormTypes.DEL,
    list,
    clipboard,
    selectedTypes: selectedTypes(store),
    selectedPoints: selectedPoints(store),
  }
}

const mapDispatchToProps = {
  onCut: selectionActions.cut,
  onCopy: selectionActions.copy,
  onPaste: selectionActions.paste,
  onDelete: selectionActions.showDeleteForm,
  onDeleteOk: selectionActions.deleteSelected,
  onDeleteCancel: selectionActions.hideForm,
  onMirrorImage: selectionActions.mirrorImage,
  onContour: selectionActions.createContour,
  onDecontour: selectionActions.dropContour,
  onGroup: groupsActions.createGroup,
  onGroupRegion: groupsActions.createGroupRegion,
  onUngroup: groupsActions.dropGroup,
}

const SelectionButtonsContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps)
)(SelectionButtons)

export default SelectionButtonsContainer
