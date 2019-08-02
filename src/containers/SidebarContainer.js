import { connect } from 'react-redux'
import Sidebar from '../layouts/Sidebar'
import * as viewModesKeys from '../constants/viewModesKeys'
import { mapCOP } from '../store/selectors'

const mapStateToProps = (store) => ({
  visible: store.viewModes[viewModesKeys.sidebar],
  printStatus: Boolean(store.print.mapId),
  marchEdit: store.march.marchEdit,
  isMapCOP: mapCOP(store),
})

export default connect(
  mapStateToProps,
)(Sidebar)
