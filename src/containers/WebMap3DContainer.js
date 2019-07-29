import { connect } from 'react-redux'
import { batchActions } from 'redux-batched-actions'
import WebMap3DInner from '../components/WebMap3D'
import { setZoom } from '../store/actions/webMap3D'
import * as webMap from '../store/actions/webMap'

const mapStateToProps = (state) => {
  const { webMap: { subordinationLevel, objects } } = state
  const filteredObjects = objects.filter((item) => item.level >= subordinationLevel)
  return {
    objects: filteredObjects,
    center: state.webMap3D.center || state.webMap.center,
    zoom: state.webMap3D.zoom || state.webMap.zoom,
  }
}

const WebMap3DContainer = connect(
  mapStateToProps,
  {
    setZoom: (zoom) => batchActions([
      setZoom(zoom),
      webMap.setSubordinationLevelByZoom(),
    ]),
  }
)(WebMap3DInner)
WebMap3DContainer.displayName = 'WebMap3D'

export default WebMap3DContainer
