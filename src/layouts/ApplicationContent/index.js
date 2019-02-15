import React from 'react'
import { WebMap, PrintGrid, PrintLegendContainer } from '../../containers'
import { MapConsumer } from '../../components/WebMap/MapContext'

class ApplicationContent extends React.PureComponent {
  render () {
    return (
      <WebMap
        center={[ 48.5, 38 ]}
        zoom={14}
      >
        <MapConsumer>{(map) => map && <PrintGrid map={map} />}</MapConsumer>
        <PrintLegendContainer />
      </WebMap>
    )
  }
}

export default ApplicationContent
