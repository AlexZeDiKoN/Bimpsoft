import { connect } from 'react-redux'
import TaskModal from '../components/TaskModal'
import { task } from '../store/actions'

const mapStateToProps = (store) => store.task.modalData

const mapDispatchToProps = {
  onClose: task.close,
  onSave: task.save,
  onSend: task.send,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskModal)
