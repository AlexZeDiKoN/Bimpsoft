import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { WebMap, PrintGrid, PrintLegendContainer } from '../../containers'
import { volumeMap } from '../../constants/viewModesKeys'
import { MapConsumer } from '../../components/WebMap/MapContext'
import WebMap3DContainer from '../../containers/WebMap3DContainer'

// @TODO: center and zoom pass to WebMap3D using a real Data & make a webMap3D Container
class ApplicationContent extends React.PureComponent {
  static propTypes = {
    is3DMapMode: PropTypes.bool.isRequired,
  }

  render () {
    const { is3DMapMode } = this.props
    return (
      <>
        {
          is3DMapMode
            ? <WebMap3DContainer />
            : <WebMap center={[ 48.5, 38 ]} zoom={14} >
              <MapConsumer>{(map) => map && <PrintGrid map={map} />}</MapConsumer>
              <PrintLegendContainer />
            </WebMap>
        }
      </>

    )
  }
}

const mapStateToProps = (store) => ({
  is3DMapMode: store.viewModes[volumeMap],
})

export default connect(mapStateToProps)(ApplicationContent)
