import { connect } from 'react-redux'
import GeoLandmarkModal from '../components/GeoLandmarkModal'
import * as webMap from '../store/actions/webMap'
import * as march from '../store/actions/march'

const mapStateToProps = (store) => ({
  visible: store.webMap.geoLandmark.visible,
  coordinates: store.webMap.geoLandmark.coordinates,
})

const mapDispatchToProps = {
  onClose: () => webMap.toggleGeoLandmarkModal(false),
  addGeoLandmark: march.addGeoLandmark,
}

export default connect(mapStateToProps, mapDispatchToProps)(GeoLandmarkModal)
