import { connect } from 'react-redux'
import { print, setPrintScale, setPrintRequisites, clearPrintRequisites } from '../../../store/actions/print'

import WrappedPrintPanel from './PrintPanel'

const PrintPanel = connect(
  ({ maps: { byId }, print: { requisites, printScale, mapId } }) => {
    const printMap = byId[mapId]
    return {
      docConfirm: (printMap && printMap.docConfirm) || {},
      securityClassification: (printMap && printMap.securityClassification) || {},
      requisites,
      printScale,
    }
  },
  {
    print,
    setPrintScale,
    setPrintRequisites,
    clearPrintRequisites,
  }
)(WrappedPrintPanel)

export default PrintPanel
