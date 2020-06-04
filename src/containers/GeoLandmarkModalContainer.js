import { connect } from 'react-redux'
import GeoLandmarkModal from '../components/GeoLandmarkModal'
import * as actions from '../store/actions/webMap'

const mapStateToProps = (store) => ({
  reportMap: store.webMap.reportMap,
  maps: store.maps,
  layers: store.layers,
})

const mapDispatchToProps = {
  //onOpen: () => actions.toggleReportMapModal(true),
  //onClose: () => actions.toggleReportMapModal(false),
  //saveCopReport: (mapName, fromMapId, dateOn) => actions.saveCopReport(mapName, fromMapId, dateOn),
}

export default connect(mapStateToProps, mapDispatchToProps)(GeoLandmarkModal)
