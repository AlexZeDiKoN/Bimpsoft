import { connect } from 'react-redux'
import WebMapInner from '../components/WebMap'
import * as webMapActions from '../store/actions/webMap'
import * as selectionActions from '../store/actions/selection'
import * as layersActions from '../store/actions/layers'
import { canEditSelector, visibleLayersSelector } from '../store/selectors'
import * as orgStructuresActions from '../store/actions/orgStructures'

const WebMap = connect(
  (state) => ({
    sources: state.webMap.source.sources,
    objects: state.webMap.objects,
    center: state.webMap.center,
    zoom: state.webMap.zoom,
    edit: canEditSelector(state),
    searchResult: state.viewModes.searchResult,
    selection: state.selection,
    layer: state.layers.selectedId,
    level: state.webMap.subordinationLevel,
    layersById: visibleLayersSelector(state),
    backOpacity: state.layers.backOpacity,
    hiddenOpacity: state.layers.hiddenOpacity,
    coordinatesType: state.webMap.coordinatesType,
    showMiniMap: state.webMap.showMiniMap,
    showAmplifiers: state.webMap.showAmplifiers,
    isMeasureOn: state.webMap.isMeasureOn,
    params: state.params,
    isGridActive: state.viewModes.print,
    backVersion: state.webMap.version,
    myContactId: state.webMap.contactId,
    lockedObjects: state.webMap.lockedObjects,
  }),
  (dispatch) => ({
    onFinishDrawNewShape: (geometry) => dispatch(selectionActions.finishDrawNewShape(geometry)),
    updateObjectGeometry: (id, geometry) => dispatch(webMapActions.updateObjectGeometry(id, geometry)),
    addObject: (object) => dispatch(webMapActions.addObject(object)),
    editObject: () => dispatch(selectionActions.showEditForm),
    onSelectedList: (list) => dispatch(selectionActions.selectedList(list)),
    onSelectUnit: (unitID) => {
      dispatch(orgStructuresActions.setOrgStructureSelectedId(unitID))
      dispatch(orgStructuresActions.expandTreeByOrgStructureItem(unitID))
    },
    onChangeLayer: (layerId) => dispatch(layersActions.selectLayer(layerId)),
    showCreateForm: () => dispatch(selectionActions.showCreateForm),
    onMove: (center, zoom, params) => dispatch(webMapActions.setCenter(center, zoom, params)),
    onDropUnit: (unitID, point) => dispatch(selectionActions.newShapeFromUnit(unitID, point)),
    stopMeasuring: () => dispatch(webMapActions.setMeasure(false)),
    requestAppInfo: () => dispatch(webMapActions.getAppInfo()),
    tryLockObject: (objectId) => dispatch(webMapActions.tryLockObject(objectId)),
    tryUnlockObject: (objectId) => dispatch(webMapActions.tryUnlockObject(objectId)),
  }),
)(WebMapInner)
WebMap.displayName = 'WebMap'

export default WebMap
