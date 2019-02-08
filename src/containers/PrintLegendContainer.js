import { connect } from 'react-redux'
import { setSelectedZone } from '../store/actions/print'
import MapPrintLegend from '../components/WebMap/MapPrintLegend'

const PrintLegendContainer = connect(
  ({ maps: { byId }, print: { requisites, printScale, mapId, selectedZone } }) => {
    const printMap = byId[mapId]
    return {
      printStatus: Boolean(mapId),
      printScale: printScale,
      selectedZone: selectedZone,
      requisites: requisites,
      securityClassification: (printMap && printMap.securityClassification) || {},
    }
  },
  {
    setSelectedZone,
  }
)(MapPrintLegend)

export default PrintLegendContainer
