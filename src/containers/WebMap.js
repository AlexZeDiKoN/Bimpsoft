import { connect } from 'react-redux'
import WebMapInner from '../components/WebMap'
import * as layers from '../store/actions/layers'
import * as webMapActions from '../store/actions/webMap'
import * as selectionActions from '../store/actions/selection'
import { getGeometry } from '../components/WebMap/leaflet.pm.patch'

const objProps = (obj) => {
  const { id, type, code, attributes, affiliation, unit, level } = obj.object
  const coordinatesArray = getGeometry(obj).geometry.map(({ lat, lng }) => ({ lng, lat }))
  return {
    id: +id,
    type: +type,
    code,
    amplifiers: attributes ? attributes.toJS() : attributes,
    affiliation,
    unit,
    subordinationLevel: +level,
    coordinatesArray, // geometry.map(({ lat, lng }) => ({ x: lng, y: lat })).toJS(),
  }
}

const WebMap = connect(
  (state) => ({
    sources: state.webMap.source.sources,
    objects: state.webMap.objects,
    center: state.webMap.center,
    zoom: state.webMap.zoom,
    edit: state.viewModes.edit,
    searchResult: state.viewModes.searchResult,
    selection: state.selection,
    layer: state.layers.selectedId,
    level: state.webMap.subordinationLevel,
    showMiniMap: state.webMap.showMiniMap,
    showAmplifiers: state.webMap.showAmplifiers,
    isGridActive: state.viewModes.print,
  }),
  (dispatch) => ({
    addObject: (object) => dispatch(layers.addObject(object)),
    deleteObject: (id) => dispatch(layers.deleteObject(id)),
    editObject: () => dispatch(selectionActions.showEditForm),
    updateObject: (object) => dispatch(layers.updateObject(object)),
    updateObjectGeometry: (object) => dispatch(layers.updateObjectGeometry(object)),
    onSelection: (selected) => dispatch(selected
      ? selectionActions.setSelection(objProps(selected))
      : selectionActions.clearSelection),
    setNewShapeCoordinates: ({ lat, lng }) => dispatch(selectionActions.setNewShapeCoordinates({ lng, lat })),
    showCreateForm: () => dispatch(selectionActions.showCreateForm),
    hideForm: () => dispatch(selectionActions.hideForm),
    // TODO: пибрати це після тестування
    loadTestObjects: () => dispatch(layers.selectLayer(null)),
    onMove: (center) => dispatch(webMapActions.setCenter(center)),
    onDropUnit: (unitID, point) => dispatch(selectionActions.newShapeFromUnit(unitID, point)),
  }),
)(WebMapInner)
WebMap.displayName = 'WebMap'

export default WebMap
