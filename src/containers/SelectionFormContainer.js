import { connect } from 'react-redux'
import SelectionForm from '../components/SelectionForm'
import { selection } from '../store/actions'
import { canEditSelector } from '../store/selectors'
import { FormTypes } from '../constants'
import { catchErrors } from '../store/actions/asyncAction'

const mapStateToProps = (store) => {
  const { selection: { preview }, orgStructures } = store
  const canEdit = canEditSelector(store)
  const showForm = preview && preview.id ? FormTypes.EDIT : FormTypes.CREATE
  return { canEdit, showForm, data: preview, orgStructures }
}

const mapDispatchToProps = {
  onChange: selection.setPreview,
  onOk: selection.savePreview,
  onCancel: selection.clearPreview,
  onCoordinateFocusChange: selection.setPreviewCoordinate,
}

const SelectionFormContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps)
)(SelectionForm)

export default SelectionFormContainer
