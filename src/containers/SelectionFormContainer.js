import { connect } from 'react-redux'
import SelectionForm from '../components/SelectionForm'
import { selection, ovt as ovtActions } from '../store/actions'
import { canEditSelector } from '../store/selectors'
import { FormTypes } from '../constants'
import { catchErrors } from '../store/actions/asyncAction'

const mapStateToProps = (store) => {
  const { selection: { preview }, orgStructures, ovt: ovtReducer } = store
  const canEdit = canEditSelector(store)
  const showForm = preview && preview.id ? FormTypes.EDIT : FormTypes.CREATE
  return { canEdit, showForm, data: preview, orgStructures, ovtData: ovtReducer.ovtData, ovtLoaded: ovtReducer.loaded }
}

const mapDispatchToProps = {
  onChange: selection.setPreview,
  onOk: selection.savePreview,
  onCancel: selection.clearPreview,
  onCoordinateFocusChange: selection.setPreviewCoordinate,
  getOvtList: ovtActions.getOvtList,
}

const SelectionFormContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps)
)(SelectionForm)

export default SelectionFormContainer
