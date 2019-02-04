import { connect } from 'react-redux'
import { setSelectedZone } from '../store/actions/print'
import PrintInner from '../services/coordinateGrid/print'
import { catchErrors } from '../store/actions/asyncAction'

const PrintGrid = connect(
  (state) => ({
    printStatus: Boolean(state.print.mapId),
    printScale: state.print.printScale,
    selectedZone: state.print.selectedZone,
  }),
  catchErrors({
    setSelectedZone,
  })
)(PrintInner)

export default PrintGrid
