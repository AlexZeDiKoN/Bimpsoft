import React from 'react'
import { WebMap, PrintGrid } from '../../containers'

class ApplicationContent extends React.PureComponent {
  render () {
    return (
      <WebMap
        center={[ 48.5, 38 ]}
        zoom={14}
      >
        {(map) => <>
          <PrintGrid map={map} />
        </>}
      </WebMap>
    )
  }
}

export default ApplicationContent
