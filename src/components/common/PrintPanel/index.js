import { connect } from 'react-redux'
import { printScale } from '../../../store/actions/print'

import WrappedPrintPanel from './PrintPanel'

const PrintPanel = connect(
  (state) => (
    {
      docConfirm: state.maps.byId.docInfo ? state.maps.byId.docInfo.doc_confirm : ``,
      securityClassification: state.maps.byId.docInfo ? state.maps.byId.docInfo.security_classification : ``,
    }
  ),
  {
    printScale,
  }
)(WrappedPrintPanel)

export default PrintPanel
