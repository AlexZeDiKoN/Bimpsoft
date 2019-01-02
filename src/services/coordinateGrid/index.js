import { connect } from 'react-redux'
import PrintInner from './print'

const PrintGrid = connect(
  (state) => ({
    printStatus: state.print.printStatus,
    printScale: state.print.printScale,
  })
)(PrintInner)

export default PrintGrid
