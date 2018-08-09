import { connect } from 'react-redux'
import WebMapInner from '../components/WebMap'
import * as layers from '../store/actions/layers'
import * as selection from '../store/actions/selection'

const WebMap = connect(
  (state) => ({
    source: state.webMap.source.sources[state.webMap.source.sources.length - 1],
    objects: state.webMap.objects,
    showMiniMap: state.webMap.showMiniMap,
    isGridActive: state.viewModes.print,
  }),
  (dispatch) => ({
    addObject: (object) => dispatch(layers.addObject(object)),
    deleteObject: (id) => dispatch(layers.deleteObject(id)),
    updateObject: (object) => dispatch(layers.updateObject(object)),
    onSelection: (selected) => dispatch(selected ? selection.setSelection(selected) : selection.clearSelection()),
    // TODO: пибрати це після тестування
    loadTestObjects: () => dispatch(layers.selectLayer(null)),
  }),
)(WebMapInner)
WebMap.displayName = 'WebMap'

export default WebMap

/*

        <Tiles
          source="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={20}
        />
        <Tiles
          source="http://10.8.26.84/api/BaseMapLayer/ato/{z}/{y}/{x}"
          tms={true}
          maxZoom={20}
        />

*/
