import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import WebMapInner from '../components/WebMap'
import * as layers from '../store/actions/layers'
import * as webMapActions from '../store/actions/webMap'
import * as selectionActions from '../store/actions/selection'
import { getGeometry } from '../components/WebMap/leaflet.pm.patch'
import { mapObjConvertor } from '../utils'

const mapProps = [ 'mapId', 'visible' ]
const layerProps = [ 'layerId', 'mapId', 'visible' ]

const extract = (object, props) => props.reduce((result, prop) => ({ ...result, [prop]: object[prop] }), {})

const isVisible = (map) => map && map.visible

const getMaps = (state) => Object.keys(state.maps.byId).map((key) => extract(state.maps.byId[key], mapProps))

const getLayers = (state) => Object.keys(state.layers.byId).map((key) => extract(state.layers.byId[key], layerProps))

const visibleLayers = createSelector(
  getMaps,
  getLayers,
  (maps, layers) => layers
    .filter(({ mapId, visible }) => visible && isVisible(maps.find(({ mapId: id }) => id === mapId)))
    .map(({ layerId }) => layerId)
    .sort()
    .join(',')
)

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
    visibleLayers: state.layers.visible ? visibleLayers(state) : '',
    backOpacity: state.layers.backOpacity,
    hiddenOpacity: state.layers.hiddenOpacity,
    coordinatesType: state.webMap.coordinatesType,
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
      ? selectionActions.setSelection(mapObjConvertor.toSelection(selected.object.mergeDeep(getGeometry(selected))))
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
