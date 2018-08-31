import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SelectionForm from '../components/SelectionForm'
import * as selectionActions from '../store/actions/selection'
import * as templatesActions from '../store/actions/templates'
import * as viewModesKeys from '../constants/viewModesKeys'

const updateActions = {
  edit: selectionActions.updateSelection,
  create: selectionActions.updateNewShape,
}

const mapStateToProps = (store) => {
  const { selection, orgStructures, viewModes: { [viewModesKeys.edit]: canEdit } } = store
  const { byIds, roots, formation } = orgStructures
  const { showForm } = selection
  let data = null
  if (showForm === 'create') {
    data = selection.newShape
  } else if (showForm === 'edit') {
    data = selection.data
  }
  return { canEdit, showForm, data, orgStructures: { byIds, roots, formation } }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  onChange: (data) => (_, getState) => {
    const { selection: { showForm } } = getState()
    return dispatch(updateActions[showForm](data))
  },
  onAddToTemplates: templatesActions.setForm,
  onCancel: () => selectionActions.hideForm,
}, dispatch)

const SelectionFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectionForm)

export default SelectionFormContainer
