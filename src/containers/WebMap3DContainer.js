import { connect } from 'react-redux'
import { batchActions } from 'redux-batched-actions'
import memoize from 'memoize-one'
import WebMap3DInner from '../components/WebMap3D'
import { setZoom } from '../store/actions/webMap3D'
import * as webMap from '../store/actions/webMap'
import * as selection from '../store/actions/selection'

// @TODO: сделать общий метод фильтрации с мемоизацией
const filterObjects = memoize((subordinationLevel, objects, layers) =>
  objects.filter((item) => item.level >= subordinationLevel && layers[item.layer].visible),
)

const mapStateToProps = (state) => {
  const {
    webMap: { subordinationLevel, objects, sources, source, mode },
    layers: { byId: layers },
    selection: { list },
  } = state
  const boundsMap = window.webMap?.getBoundsMap()
  const filteredObjects = filterObjects(subordinationLevel, objects, layers)
  return {
    sources,
    source,
    objects: filteredObjects,
    center: state.webMap3D.center || state.webMap.center,
    zoom: state.webMap3D.zoom || state.webMap.zoom,
    boundsMap: boundsMap || state.webMap.bounds,
    mode,
    selected: list,
  }
}

const mapDispatchToProps = {
  setZoom: (zoom) => batchActions([
    setZoom(zoom),
    webMap.setSubordinationLevelByZoom(),
  ]),
  setCenter: webMap.setCenter,
  setMapMode: webMap.setMapMode,
  setSource: webMap.setSource,
  editObject: selection.showEditForm,
}

const WebMap3DContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(WebMap3DInner)
WebMap3DContainer.displayName = 'WebMap3D'

export default WebMap3DContainer
