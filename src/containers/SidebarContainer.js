import { connect } from 'react-redux'
import Sidebar from '../layouts/Sidebar'
import * as viewModesKeys from '../constants/viewModesKeys'
import { mapCOP } from '../store/selectors'

const mapStateToProps = (store) => ({
  visible: store.viewModes[viewModesKeys.sidebar],
  printStatus: Boolean(store.print.mapId),
  marchEdit: store.march.marchEdit,
  isMapCOP: mapCOP(store),
  is3DMapMode: store.viewModes[viewModesKeys.map3D],
})

export default connect(
  mapStateToProps,
)(Sidebar)
