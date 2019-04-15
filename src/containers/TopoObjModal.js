import { connect } from 'react-redux'
import TopoObjModal from '../components/TopoObjModal'
import * as topoObj from '../store/actions/webMap'

const mapStateToProps = (store) => ({
  topographicObjects: store.webMap.topographicObjects,
  serviceStatus: store.webMap.isTopographicObjectsOn,
})

const mapDispatchToProps = {
  onClose: topoObj.toggleTopographicObjModal,
  selectTopographicItem: topoObj.selectTopographicItem,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopoObjModal)
