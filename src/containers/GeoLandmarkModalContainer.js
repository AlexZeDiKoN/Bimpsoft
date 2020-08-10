import { connect } from 'react-redux'
import GeoLandmarkModal from '../components/GeoLandmarkModal'
import * as webMap from '../store/actions/webMap'
import * as march from '../store/actions/march'

const mapStateToProps = (store) => {
  const { visible, coordinates, segmentId, childId } = store.webMap.geoLandmark
  return {
    visible,
    coordinates,
    segmentId,
    childId,
  }
}

const mapDispatchToProps = {
  onClose: () => webMap.toggleGeoLandmarkModal(false),
  addGeoLandmark: march.addGeoLandmark,
}

export default connect(mapStateToProps, mapDispatchToProps)(GeoLandmarkModal)
