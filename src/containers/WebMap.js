import { connect } from 'react-redux'
import WebMapInner from '../components/WebMap'
import * as layers from '../store/actions/layers'
import * as selection from '../store/actions/selection'

const WebMap = connect(
  (state) => ({
    sources: state.webMap.source.sources,
    objects: state.webMap.objects,
    edit: state.viewModes.edit,
    selection: state.selection,
    showMiniMap: state.webMap.showMiniMap,
    isGridActive: state.viewModes.print,
  }),
  (dispatch) => ({
    addObject: (object) => dispatch(layers.addObject(object)),
    deleteObject: (id) => dispatch(layers.deleteObject(id)),
    updateObject: (object) => dispatch(layers.updateObject(object)),
    onSelection: (selected) => dispatch(selected ? selection.setSelection(selected) : selection.clearSelection),
    setNewShapeCoordinates: ({ lat, lng }) => dispatch(selection.setNewShapeCoordinates({ x: lng, y: lat })),
    showCreateForm: () => dispatch(selection.showCreateForm),
    // TODO: пибрати це після тестування
    loadTestObjects: () => dispatch(layers.selectLayer(null)),
  }),
)(WebMapInner)
WebMap.displayName = 'WebMap'

export default WebMap
