import { connect } from 'react-redux'
import { catchErrors } from '../../../store/actions/asyncAction'
import {
  print, setPrintScale, setPrintRequisites,
  clearPrintRequisites, createPrintFile,
} from '../../../store/actions/print'

import WrappedPrintPanel from './PrintPanel'

const PrintPanel = connect(
  ({ maps: { byId }, print: { requisites, printScale, mapId } }) => {
    const printMap = byId[mapId]
    return {
      docConfirm: (printMap && printMap.docConfirm) || {},
      securityClassification: (printMap && printMap.securityClassification) || {},
      printScale,
      requisites,
    }
  },
  catchErrors({
    print,
    setPrintScale,
    setPrintRequisites,
    clearPrintRequisites,
    createPrintFile,
  }),
)(WrappedPrintPanel)

export default PrintPanel
