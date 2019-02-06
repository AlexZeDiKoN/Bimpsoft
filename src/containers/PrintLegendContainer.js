import { connect } from 'react-redux'
import { setSelectedZone } from '../store/actions/print'
import MapPrintLegend from '../components/WebMap/MapPrintLegend'

const PrintLegendContainer = connect(
  (state) => ({
    printStatus: Boolean(state.print.mapId),
    printScale: state.print.printScale,
    selectedZone: state.print.selectedZone,
    requisites: state.print.requisites,
  }),
  {
    setSelectedZone,
  }
)(MapPrintLegend)

export default PrintLegendContainer
