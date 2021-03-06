import { connect } from 'react-redux'
import Sidebar from '../layouts/Sidebar'
import { mapCOP, selectedLayerId } from '../store/selectors'
import * as viewModesActions from '../store/actions/viewModes'
import { catchErrors } from '../store/actions/asyncAction'
const mapStateToProps = (store) => ({
  printStatus: Boolean(store.print.mapId),
  marchEdit: store.march.marchEdit,
  isHaveActiveLayer: Boolean(selectedLayerId(store)),
  isMapCOP: mapCOP(store),
  sidebarSelectedTabIndex: store.viewModes.sidebarSelectedTabIndex,
})

const mapDispatchToProps = {
  setSidebarTabIndex: viewModesActions.viewModeSetSidebarTabIndex,
}

export default connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps),
)(Sidebar)
