import { connect } from 'react-redux'
import TopoObjModal from '../components/TopoObjModal'
import * as topoObj from '../store/actions/webMap'

const mapStateToProps = (store) => ({
  topographicObjects: store.webMap.topographicObjects,
})
const mapDispatchToProps = (dispatch) => ({
  onClose: () => {
    dispatch(topoObj.toggleTopographicObjects())
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopoObjModal)
