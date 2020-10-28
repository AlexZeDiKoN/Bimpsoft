import { connect } from 'react-redux'
import ZoneVisionModal from '../components/ZoneVisionModal'
import { viewModesKeys } from '../constants'
import { close } from '../store/actions/task'
import { getBlindZone } from '../store/actions/elevationProfile'

const saveHandler = (values) => async (dispatch, getState, { webmapApi: { getZoneVision } }) => {
  const items = getState().task?.modalData?.targets
  const data = {
    x1: items[0]._latlng.lng,
    y1: items[0]._latlng.lat,
    x2: items[1]._latlng.lng,
    y2: items[1]._latlng.lat,
    sector: values?.angle,
    src_height: values?.heightObserver,
    dst_height: values?.heightTarget,
  }
  dispatch(getBlindZone(data))
}

const mapStateToProps = (store) => ({
  visible: store.task?.modalData?.type === viewModesKeys.zoneVision,
  targets: store.task?.modalData?.targets,
  onClear: store.task?.modalData?.onClear,
})

const mapDispatchToProps = {
  onClose: close,
  onSave: saveHandler,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ZoneVisionModal)
