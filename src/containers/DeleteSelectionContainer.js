import { connect } from 'react-redux'
import DeleteSelectionForm from '../components/DeleteSelectionForm'

const mapStateToProps = (store) => {
  const { selection: { showForm, list } } = store
  return { showForm, list }
}

const mapDispatchToProps = (dispatch) => {
}

const DeleteSelectionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteSelectionForm)

export default DeleteSelectionContainer
