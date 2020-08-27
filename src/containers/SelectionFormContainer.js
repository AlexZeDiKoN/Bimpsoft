import { connect } from 'react-redux'
import SelectionForm from '../components/SelectionForm'
import { selection, ovt as ovtActions } from '../store/actions'
import { canEditSelector } from '../store/selectors'
import { FormTypes, viewModesKeys } from '../constants'
import { catchErrors } from '../store/actions/asyncAction'

const mapStateToProps = (store) => {
  const {
    selection: { preview, showForm, errorCode },
    orgStructures, ovt: ovtReducer,
    viewModes: { [viewModesKeys.sidebarOpen]: sidebar },
  } = store
  const canEdit = canEditSelector(store)
  const showFormTypes = preview && preview.id ? FormTypes.EDIT : FormTypes.CREATE
  const showErrorSave = showForm === FormTypes.ERROR_SAVE

  return { canEdit,
    showForm: showFormTypes,
    showErrorSave,
    data: preview,
    orgStructures,
    sidebar,
    ovtData: ovtReducer.ovtData,
    ovtLoaded: ovtReducer.loaded,
    errorCode,
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
}

const SelectionFormContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps),
)(SelectionForm)

export default SelectionFormContainer
