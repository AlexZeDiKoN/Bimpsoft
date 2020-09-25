import { connect } from 'react-redux'
import SelectionButtons from '../components/menu/SelectionButtons'
import { FormTypes } from '../constants'
import {
  canEditSelector,
  layerNameSelector,
  selectedTypes,
  selectedPoints,
  flexGridSelected,
} from '../store/selectors'
import { selection as selectionActions, groups as groupsActions } from '../store/actions'
import { catchErrors } from '../store/actions/asyncAction'

const mapStateToProps = (store) => {
  const {
    selection: {
      showForm,
      list,
      clipboard,
      doubleObjects,
      preview,
    },
    orgStructures,
    webMap: { objects },
    layers: { selectedId },
  } = store

  return {
    isEditMode: canEditSelector(store),
    layerId: selectedId,
    objectsMap: objects,
    layerName: layerNameSelector(store),
    showDelForm: showForm === FormTypes.DEL,
    showErrorPasteForm: showForm === FormTypes.ERROR_PAST,
    doubleObjects: showForm === FormTypes.ERROR_PAST ? doubleObjects : undefined,
    list,
    clipboard,
    orgStructures,
    isShowForm: Boolean(preview || showForm), // признак отображения на карте какой-либо формы ввода или подстверждения
    selectedTypes: selectedTypes(store),
    selectedPoints: selectedPoints(store),
    flexGridSelected: flexGridSelected(store),
  }
}

const mapDispatchToProps = {
  onCut: selectionActions.cut,
  onCopy: selectionActions.copy,
  onPaste: selectionActions.paste,
  onPasteError: selectionActions.showErrorPasteForm,
  onPasteOk: selectionActions.paste,
  onPasteCancel: selectionActions.hideForm,
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
  catchErrors(mapDispatchToProps),
)(SelectionButtons)

export default SelectionButtonsContainer
