import { connect } from 'react-redux'
import Sidebar from '../layouts/Sidebar'
import * as viewModesKeys from '../constants/viewModesKeys'
import { mapCOP } from '../store/selectors'
import { setSidebar } from '../store/actions/sidebar'

const mapStateToProps = (store) => ({
  visible: store.viewModes[viewModesKeys.sidebar],
  printStatus: Boolean(store.print.mapId),
  marchEdit: store.march.marchEdit,
  isMapCOP: mapCOP(store),
  is3DMapMode: store.viewModes[viewModesKeys.map3D],
  sidebar: store?.sidebar?.sidebar,
})

const mapDispatchToProps = {
  setSidebar,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Sidebar)
