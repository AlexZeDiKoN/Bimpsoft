import React from 'react'
import WebMap from '../../containers/WebMap'

class ApplicationContent extends React.PureComponent {
  // TODO: запам'ятовувати попередній вигляд карти у localStorage
  render () {
    return (
      <WebMap
        center={[ 48.5, 38 ]}
        zoom={14}
      />
    )
  }
}

export default ApplicationContent
