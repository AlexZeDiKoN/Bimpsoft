import { connect } from 'react-redux'
import { batchActions } from 'redux-batched-actions'
import memoize from 'memoize-one'
import WebMap3DInner from '../components/WebMap3D'
import { setZoom } from '../store/actions/webMap3D'
import * as webMap from '../store/actions/webMap'

// @TODO: сделать общий метод фильтрации с мемоизацией
const filterObjects = memoize(
  (subordinationLevel, objects) => objects.filter((item) => item.level >= subordinationLevel)
)

const mapStateToProps = (state) => {
  const { webMap: { subordinationLevel, objects, sources, source, mode } } = state
  const filteredObjects = filterObjects(subordinationLevel, objects)
  return {
    sources,
    source,
    objects: filteredObjects,
    center: state.webMap3D.center || state.webMap.center,
    zoom: state.webMap3D.zoom || state.webMap.zoom,
    mode,
  }
}

const mapDispatchToProps = {
  setZoom: (zoom) => batchActions([
    setZoom(zoom),
    webMap.setSubordinationLevelByZoom(),
  ]),
  setMapMode: webMap.setMapMode,
  setSource: webMap.setSource,
}

const WebMap3DContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(WebMap3DInner)
WebMap3DContainer.displayName = 'WebMap3D'

export default WebMap3DContainer
