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
    orgStructures,
    layers: { selectedId: layerId = null },
  } = store

  const getSameObjects = (layer, unit, code, type) =>
    (store.webMap.objects.filter((value) => (value.type === type &&
      value.layer === layer &&
      value.unit === unit &&
      value.code === code)))

  return {
    isEditMode: canEditSelector(store),
    layerName: layerNameSelector(store),
    showDelForm: showForm === FormTypes.DEL,
    showErrorPasteForm: showForm === FormTypes.ERROR_PAST,
    list,
    clipboard,
    orgStructures,
    getSameObjects,
    layerId,
    selectedTypes: selectedTypes(store),
    selectedPoints: selectedPoints(store),
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
