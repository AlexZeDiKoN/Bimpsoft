import { connect } from 'react-redux'
import PrintInner from './print'

const PrintGrid = connect(
  (state) => ({
    printStatus: Boolean(state.print.mapId),
    printScale: state.print.printScale,
  })
)(PrintInner)

export default PrintGrid
