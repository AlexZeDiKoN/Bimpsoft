import { connect } from 'react-redux'
import ZoneProfileModal from '../components/ZoneProfileModal'
import { viewModesKeys } from '../constants'
import { close } from '../store/actions/task'

const mapStateToProps = (store) => ({
  visible: store.task?.modalData?.type === viewModesKeys.zoneProfile,
  targets: store.task?.modalData?.targets,
  onClear: store.task?.modalData?.onClear,
})

const mapDispatchToProps = {
    onClose: close,
    onSave: () => async (dispatch, getState, { webmapApi: { heightProfile }} ) => {
      const items = getState().task?.modalData?.targets
      const data = {
        x1: items[0]._latlng.lat,
        y1: items[0]._latlng.lng,
        x2: items[1]._latlng.lat,
        y2: items[1]._latlng.lng,
      }
      const res = await heightProfile(data)
      console.log(res)
    }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ZoneProfileModal)
