import { connect } from 'react-redux'
import ZoneVisionModal from '../components/ZoneVisionModal'
import { viewModesKeys } from '../constants'
import { close } from '../store/actions/task'
import { setVisionZoneData } from '../store/actions/webMap'

const saveHandler = (values) => async (dispatch, getState, { webmapApi: { getZoneVision } }) => {
  const items = getState().task?.modalData?.targets
  const data = {
    x1: items[0]._latlng.lat,
    y1: items[0]._latlng.lng,
    x2: items[1]._latlng.lat,
    y2: items[1]._latlng.lng,
    ...values,
  }
  console.log(data)
  return true

  // const res = await getZoneVision(data)
  // const success = typeof res === 'object'
  // if (success) {
  //   dispatch(setVisionZoneData({ ...res }))
  // }

  // return success
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
