import { connect } from 'react-redux'
import DeleteMarchModal from '../components/DeleteMarchModal'
import * as webMap from '../store/actions/webMap'
import * as march from '../store/actions/march'

const mapStateToProps = (store) => {
  const { visible, segmentId, childId } = store.webMap.deleteMarchPointModal
  return {
    visible,
    segmentId,
    childId,
  }
}

const mapDispatchToProps = {
  onClose: () => webMap.toggleDeleteMarchPointModal(false),
  deleteChild: march.deleteChild,
  deleteSegment: march.deleteSegment,
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteMarchModal)
