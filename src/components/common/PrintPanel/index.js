import { connect } from 'react-redux'
import { print, setPrintScale, setPrintRequisites, clearPrintRequisites } from '../../../store/actions/print'

import WrappedPrintPanel from './PrintPanel'

const PrintPanel = connect(
  (state) => (
    {
      docConfirm: state.maps.byId.docInfo ? state.maps.byId.docInfo.doc_confirm : ``,
      securityClassification: state.maps.byId.docInfo ? state.maps.byId.docInfo.security_classification : ``,
      requisites: state.print.requisites,
      printScale: state.print.printScale,
    }
  ),
  {
    print,
    setPrintScale,
    setPrintRequisites,
    clearPrintRequisites,
  }
)(WrappedPrintPanel)

export default PrintPanel
