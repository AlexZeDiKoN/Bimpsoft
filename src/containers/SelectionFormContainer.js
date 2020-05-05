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
  // console.log('layers', JSON.stringify(webMap.objects.map(({ id, code, layer }) => { return { id, code, layer } })))
  const getSameObjects = (layer, unit, code, type) =>
    (store.webMap.objects.filter((value) => (value.type === type &&
      value.layer === layer &&
      value.unit === unit &&
      value.code === code)))

  return { canEdit,
    showForm,
    data: preview,
    orgStructures,
    ovtData: ovtReducer.ovtData,
    ovtLoaded: ovtReducer.loaded,
    getSameObjects }
}

const mapDispatchToProps = {
  onChange: selection.setPreview,
  onOk: selection.savePreview,
  onCancel: selection.clearPreview,
  onSaveError: selection.showErrorPasteForm,
  onCoordinateFocusChange: selection.setPreviewCoordinate,
  getOvtList: ovtActions.getOvtList,
}

const SelectionFormContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps),
)(SelectionForm)

export default SelectionFormContainer
