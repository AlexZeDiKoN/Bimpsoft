import { connect } from 'react-redux'
import WebMapInner from '../components/WebMap'
import * as webMapActions from '../store/actions/webMap'
import * as selectionActions from '../store/actions/selection'
import * as layersActions from '../store/actions/layers'
import { getGeometry } from '../components/WebMap/Tactical'
import { mapObjConvertor } from '../utils'
import { pointSizesSelector } from '../store/selectors/params'
import { canEditSelector } from '../store/canEditSelector'

const WebMap = connect(
  (state) => ({
    sources: state.webMap.source.sources,
    objects: state.webMap.objects,
    center: state.webMap.center,
    zoom: state.webMap.zoom,
    edit: canEditSelector(state),
    searchResult: state.viewModes.searchResult,
    selection: state.selection,
    orgStructureSelectedId: state.orgStructures.selectedId,
    layer: state.layers.selectedId,
    level: state.webMap.subordinationLevel,
    layersById: state.layers.byId,
    backOpacity: state.layers.backOpacity,
    hiddenOpacity: state.layers.hiddenOpacity,
    coordinatesType: state.webMap.coordinatesType,
    showMiniMap: state.webMap.showMiniMap,
    showAmplifiers: state.webMap.showAmplifiers,
    isMeasureOn: state.webMap.isMeasureOn,
    pointSizes: pointSizesSelector(state), // Розмір точкового тактичного знака НАТО в залежності від масштабу (від і до)
    isGridActive: state.viewModes.print,
  }),
  (dispatch) => ({
    addObject: (object) => dispatch(webMapActions.addObject(object)),
    deleteObject: (id) => dispatch(webMapActions.deleteObject(id)),
    editObject: () => dispatch(selectionActions.showEditForm),
    updateObject: (object) => dispatch(webMapActions.updateObject(object)),
    updateObjectGeometry: (object) => dispatch(webMapActions.updateObjectGeometry(object)),
    onSelection: (selected) => dispatch(selected
      ? selectionActions.setSelection(mapObjConvertor.toSelection(selected.object.mergeDeep(getGeometry(selected))))
      : selectionActions.clearSelection),
    onSelectedList: (list) => dispatch(selectionActions.selectedList(list)),
    onChangeLayer: (layerId) => dispatch(layersActions.selectLayer(layerId)),
    setNewShapeCoordinates: ({ lat, lng }) => dispatch(selectionActions.setNewShapeCoordinates({ lng, lat })),
    showCreateForm: () => dispatch(selectionActions.showCreateForm),
    hideForm: () => dispatch(selectionActions.hideForm),
    onMove: (center) => dispatch(webMapActions.setCenter(center)),
    onDropUnit: (unitID, point) => dispatch(selectionActions.newShapeFromUnit(unitID, point)),
    stopMeasuring: () => dispatch(webMapActions.setMeasure(false)),
  }),
)(WebMapInner)
WebMap.displayName = 'WebMap'

export default WebMap
