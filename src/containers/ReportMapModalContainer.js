import { connect } from 'react-redux'
import ReportMapModal from '../components/ReportMapModal'
import * as actions from '../store/actions/webMap'

const mapStateToProps = (store) => ({
  reportMap: store.webMap.reportMap,
  //topographicObjects: store.webMap.topographicObjects,
  //serviceStatus: store.webMap.isTopographicObjectsOn,
})

const mapDispatchToProps = {
  onOpen: () => actions.toggleReportMapModal(true),
  onClose: () => actions.toggleReportMapModal(false),
  // selectTopographicItem: actions.selectTopographicItem,
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportMapModal)
