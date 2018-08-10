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

const mapDispatchToProps = (dispatch) => ({
  onChange: (data) => {
    dispatch(selectionActions.hideForm)
    dispatch(selectionActions.updateSelection(data))
  },
  onAddToTemplates: (data) => {
    dispatch(templatesActions.setForm(data))
  },
  onCancel: () => {
    dispatch(selectionActions.hideForm)
  },
})
const SelectionFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectionForm)

export default SelectionFormContainer
