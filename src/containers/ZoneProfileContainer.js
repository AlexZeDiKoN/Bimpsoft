import { connect } from 'react-redux'
import ZoneProfileModal from '../components/ZoneProfileModal'
import { viewModesKeys } from '../constants'
import { close } from '../store/actions/task'
import { getZoneHeightProfile } from '../store/actions/elevationProfile'

const saveHandler = (values) => async (dispatch, getState) => {
  const items = getState().task?.modalData?.targets
  const data = {
    x1: items[0]._latlng.lng,
    y1: items[0]._latlng.lat,
    x2: items[1]._latlng.lng,
    y2: items[1]._latlng.lat,
  }

  dispatch(getZoneHeightProfile(data, values))
}

const mapStateToProps = (store) => ({
  visible: store.task?.modalData?.type === viewModesKeys.zoneProfile,
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
)(ZoneProfileModal)
