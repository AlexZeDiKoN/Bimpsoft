import { connect } from 'react-redux'
import WebMapInner from '../components/WebMap'
import * as layers from '../store/actions/layers'
import * as selection from '../store/actions/selection'

const objProps = (obj) => {
  console.log('objProps', obj.object)
  const { id, type, code, attributes, affiliation, unit, level, geometry } = obj.object
  return {
    id: +id,
    type: +type,
    code,
    amplifiers: attributes ? attributes.toJS() : attributes,
    affiliation,
    unit,
    level: +level,
    coordinatesArray: geometry.map(({ lat, lng }) => ({ x: lng, y: lat })).toJS(),
  }
}

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
    editObject: () => dispatch(selection.showEditForm),
    updateObject: (object) => dispatch(layers.updateObject(object)),
    updateObjectGeometry: (object) => dispatch(layers.updateObjectGeometry(object)),
    onSelection: (selected) => dispatch(selected
      ? selection.setSelection(objProps(selected))
      : selection.clearSelection),
    setNewShapeCoordinates: ({ lat, lng }) => dispatch(selection.setNewShapeCoordinates({ x: lng, y: lat })),
    showCreateForm: () => dispatch(selection.showCreateForm),
    // TODO: пибрати це після тестування
    loadTestObjects: () => dispatch(layers.selectLayer(null)),
  }),
)(WebMapInner)
WebMap.displayName = 'WebMap'

export default WebMap
