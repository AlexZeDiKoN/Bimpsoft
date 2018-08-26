import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SelectionForm from '../components/SelectionForm'
import * as selectionActions from '../store/actions/selection'
import * as templatesActions from '../store/actions/templates'

const mapStateToProps = (store) => {
  const { selection, orgStructures } = store
  const { byIds, roots, formation } = orgStructures
  const { showForm } = selection
  let data = null
  if (showForm === null) {
    data = null
  } else if (showForm === 'create') {
    data = selection.newShape
  } else if (showForm === 'edit') {
    data = selection.data
  }
  return { showForm, data, orgStructures: { byIds, roots, formation } }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  onChange: (data) => (_, getState) => {
    const { selection: { showForm } } = getState()
    switch (showForm) {
      case 'edit':
        console.log('Update shape: ', data)
        return dispatch(selectionActions.updateSelection(data))
      case 'create':
        console.log('Create shape: ', data)
        return dispatch(selectionActions.updateNewShape(data))
      default:
        break
    }
  },
  onAddToTemplates: templatesActions.setForm,
  onCancel: () => selectionActions.hideForm,
}, dispatch)

const SelectionFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectionForm)

export default SelectionFormContainer
