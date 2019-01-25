import { connect } from 'react-redux'
import { setSelectedZone } from '../store/actions/print'
import PrintInner from '../services/coordinateGrid/print'

const PrintGrid = connect(
  (state) => ({
    printStatus: Boolean(state.print.mapId),
    printScale: state.print.printScale,
    selectedZone: state.print.selectedZone,
  }),
  {
    setSelectedZone,
  }
)(PrintInner)

export default PrintGrid
