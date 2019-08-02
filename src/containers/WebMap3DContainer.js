import { connect } from 'react-redux'
import { batchActions } from 'redux-batched-actions'
import WebMap3DInner from '../components/WebMap3D'
import { setZoom } from '../store/actions/webMap3D'
import * as webMap from '../store/actions/webMap'

const mapStateToProps = (state) => {
  const { webMap: { subordinationLevel, objects, sources } } = state
  const filteredObjects = objects.filter((item) => item.level >= subordinationLevel)
  return {
    objects: filteredObjects,
    center: state.webMap3D.center || state.webMap.center,
    zoom: state.webMap3D.zoom || state.webMap.zoom,
    volumeSource: sources.find(({ isSatellite }) => isSatellite), // Source with param isSatellite set to true is a satellite view
  }
}

const mapDispatchToProps = {
  setZoom: (zoom) => batchActions([
    setZoom(zoom),
    webMap.setSubordinationLevelByZoom(),
  ]),
  setSource: webMap.setSource,
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { volumeSource, ...restState } = stateProps
  const { setSource, ...restDispatch } = dispatchProps

  return {
    ...ownProps,
    ...restState,
    ...restDispatch,
    setSatelliteSource: () => setSource(volumeSource),
  }
}

const WebMap3DContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(WebMap3DInner)
WebMap3DContainer.displayName = 'WebMap3D'

export default WebMap3DContainer
