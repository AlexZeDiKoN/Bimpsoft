import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SelectionForm from '../components/SelectionForm'
import * as selectionActions from '../store/actions/selection'
import * as templatesActions from '../store/actions/templates'

const mapStateToProps = (store) => {
  const { selection } = store
  const { showForm } = selection
  let data = null
  if (showForm === null) {
    data = null
  } else if (showForm === 'create') {
    data = selection.newShape
  } else if (showForm === 'edit') {
    data = selection.data
  }
  return { data }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  onChange: (data) => (_, getState) => {
    const { selection: { showForm } } = getState()
    switch (showForm) {
      case 'edit':
        return dispatch(selectionActions.updateSelection(data))
      case 'create':
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
