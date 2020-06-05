import { connect } from 'react-redux'
import ReportMapModal from '../components/ReportMapModal'
import * as actions from '../store/actions/webMap'

const mapStateToProps = (store) => ({
  reportMap: store.webMap.reportMap,
  maps: store.maps,
  layers: store.layers,
})

const mapDispatchToProps = {
  onOpen: () => actions.toggleReportMapModal(true),
  onClose: () => actions.toggleReportMapModal(false),
  saveCopReport: actions.saveCopReport,
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportMapModal)
