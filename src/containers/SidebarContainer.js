import { connect } from 'react-redux'
import Sidebar from '../layouts/Sidebar'
import * as viewModesKeys from '../constants/viewModesKeys'

const mapStateToProps = (store) => ({
  visible: store.viewModes[viewModesKeys.sidebar],
  printStatus: store.print.printStatus,
})

export default connect(
  mapStateToProps
)(Sidebar)
