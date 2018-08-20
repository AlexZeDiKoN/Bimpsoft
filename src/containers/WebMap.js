import { connect } from 'react-redux'
import WebMapInner from '../components/WebMap'
import * as layers from '../store/actions/layers'
import * as webMapActions from '../store/actions/webMap'
import * as selection from '../store/actions/selection'
import { getGeometry } from '../components/WebMap/leaflet.pm.patch'
import SubordinationLevel from '../constants/SubordinationLevel'

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
    level: +level,
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
    level: SubordinationLevel.list.find(({ value }) => value === state.webMap.subordinationLevel).number,
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
    setNewShapeCoordinates: ({ lat, lng }) => dispatch(selection.setNewShapeCoordinates({ lng, lat })),
    showCreateForm: () => dispatch(selection.showCreateForm),
    hideForm: () => dispatch(selection.hideForm),
    // TODO: пибрати це після тестування
    loadTestObjects: () => dispatch(layers.selectLayer(null)),
    onMove: (center) => dispatch(webMapActions.setCenter(center)),
  }),
)(WebMapInner)
WebMap.displayName = 'WebMap'

export default WebMap
