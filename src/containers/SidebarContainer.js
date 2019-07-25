import { connect } from 'react-redux'
import Sidebar from '../layouts/Sidebar'
import * as viewModesKeys from '../constants/viewModesKeys'

const mapStateToProps = (store) => ({
  visible: store.viewModes[viewModesKeys.sidebar] && !store.viewModes[viewModesKeys.volumeMap],
  printStatus: Boolean(store.print.mapId),
  marchEdit: store.march.marchEdit,
})

export default connect(
  mapStateToProps
)(Sidebar)
