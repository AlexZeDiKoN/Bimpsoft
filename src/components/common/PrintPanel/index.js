import { connect } from 'react-redux'
import { printScale } from '../../../store/actions/print'

import WrappedPrintPanel from './PrintPanel'

const PrintPanel = connect(
  (state) => (
    {}
  ),
  {
    printScale,
  }
)(WrappedPrintPanel)

export default PrintPanel
