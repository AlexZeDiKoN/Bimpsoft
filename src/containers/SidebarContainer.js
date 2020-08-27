import { connect } from 'react-redux'
import Sidebar from '../layouts/Sidebar'
import * as viewModesKeys from '../constants/viewModesKeys'
import { mapCOP } from '../store/selectors'
import { catchErrors } from '../store/actions/asyncAction'
import { sidebarOpen } from '../store/actions/viewModes'

const mapStateToProps = (store) => ({
  printStatus: Boolean(store.print.mapId),
  marchEdit: store.march.marchEdit,
  isMapCOP: mapCOP(store),
  is3DMapMode: store.viewModes[viewModesKeys.map3D],
})

const mapDispatchToProps = {
  sidebarOpen
}

export default connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps),
)(Sidebar)
