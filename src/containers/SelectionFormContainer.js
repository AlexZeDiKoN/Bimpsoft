import { connect } from 'react-redux'
import SelectionForm from '../components/SelectionForm'
import { selection, ovt as ovtActions, dictionaries } from '../store/actions'
import { canEditSelector } from '../store/selectors'
import { FormTypes } from '../constants'
import { catchErrors } from '../store/actions/asyncAction'

const mapStateToProps = (store) => {
  const {
    selection: { preview, showForm, errorCode, disableSaveButton },
    orgStructures, ovt: ovtReducer,
    viewModes: { sidebarSelectedTabIndex },
    webMap: { coordinatesType },
    dictionaries: dictionariesState,
  } = store

  const canEdit = canEditSelector(store)
  const showFormTypes = preview && preview.id ? FormTypes.EDIT : FormTypes.CREATE
  const showErrorSave = showForm === FormTypes.ERROR_SAVE

  return { canEdit,
    showForm: showFormTypes,
    showErrorSave,
    data: preview,
    orgStructures,
    sidebarSelectedTabIndex,
    ovtData: ovtReducer.ovtData,
    ovtLoaded: ovtReducer.loaded,
    dictionariesLoaded: dictionariesState.loaded,
    ovtKind: dictionariesState.dictionaries?.ovtKind,
    ovtSubKind: dictionariesState.dictionaries?.ovtSubkind,
    errorCode,
    coordinatesType,
    disableSaveButton,
  }
}

const mapDispatchToProps = {
  onChange: selection.setPreview,
  onOk: selection.savePreview,
  onCancel: selection.clearPreview,
  onSaveError: selection.showErrorSaveForm,
  onCheckSave: selection.checkSaveSymbol,
  onCloseSaveError: selection.hideForm,
  onCoordinateFocusChange: selection.setPreviewCoordinate,
  getOvtList: ovtActions.getOvtList,
  getDictionaries: dictionaries.getDictionaries,
  onEnableSaveButton: selection.enableSaveButton,
}

const SelectionFormContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps),
)(SelectionForm)

export default SelectionFormContainer
