import { connect } from 'react-redux'
import { setSelectedZone, getMapAvailability } from '../store/actions/print'
import PrintInner from '../services/coordinateGrid/print'
import { catchErrors } from '../store/actions/asyncAction'

const PrintGrid = connect(
  (state) => ({
    printStatus: Boolean(state.print.mapId),
    printScale: state.print.printScale,
    selectedZone: state.print.selectedZone,
    mapAvailability: state.print.mapAvailability,
  }),
  catchErrors({
    setSelectedZone,
    getMapAvailability,
  }),
)(PrintInner)

export default PrintGrid
