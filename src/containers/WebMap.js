import { connect } from 'react-redux'
import { batchActions } from 'redux-batched-actions'
import WebMapInner from '../components/WebMap'
import {
  canEditSelector, visibleLayersSelector, activeObjectId, flexGridParams, flexGridVisible, flexGridData,
  activeMapSelector, inICTMode,
} from '../store/selectors'
import { webMap, selection, layers, orgStructures, flexGrid, viewModes } from '../store/actions'
import { catchErrors } from '../store/actions/asyncAction'
import * as topoObj from '../store/actions/webMap'
import { directionName } from '../constants/viewModesKeys'

const WebMapContainer = connect(
  (state) => ({
    sources: state.webMap.source.sources,
    objects: state.webMap.objects,
    center: state.webMap.center,
    zoom: state.webMap.zoom,
    isMarkersOn: state.webMap.isMarkersOn,
    isTopographicObjectsOn: state.webMap.isTopographicObjectsOn,
    edit: canEditSelector(state),
    marker: state.webMap.marker,
    scaleToSelection: state.webMap.scaleToSelection,
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
    activeObjectId: activeObjectId(state),
    printStatus: Boolean(state.print.mapId),
    printScale: state.print.printScale,
    flexGridParams: flexGridParams(state),
    flexGridVisible: flexGridVisible(state),
    flexGridData: flexGridData(state),
    activeMapId: activeMapSelector(state),
    inICTMode: inICTMode(state),
    selectedDirections: state.flexGrid.selectedDirections,
    topographicObjects: state.webMap.topographicObjects,
  }),
  catchErrors({
    onFinishDrawNewShape: selection.finishDrawNewShape,
    updateObjectGeometry: webMap.updateObjectGeometry,
    updateObjectAttributes: webMap.updateObjectAttributes,
    editObject: selection.showEditForm,
    onSelectedList: (list) => batchActions([
      selection.selectedList(list),
      webMap.setScaleToSelection(false),
    ]),
    onSelectUnit: (unitID) => batchActions([
      orgStructures.setOrgStructureSelectedId(unitID),
      orgStructures.expandTreeByOrgStructureItem(unitID),
    ]),
    onChangeLayer: layers.selectLayer,
    onMove: (center, zoom, isZoomChangedByUser) => {
      const batch = [
        webMap.setCenter(center, zoom),
        webMap.setScaleToSelection(false),
      ]
      isZoomChangedByUser && batch.push(webMap.setSubordinationLevelByZoom(zoom))
      return batchActions(batch)
    },
    onDropUnit: selection.newShapeFromUnit,
    stopMeasuring: webMap.toggleMeasure,
    onRemoveMarker: () => webMap.setMarker(null),
    addObject: webMap.addObject,
    requestAppInfo: webMap.getAppInfo,
    requestMaSources: webMap.getMapSources,
    getLockedObjects: webMap.getLockedObjects,
    tryLockObject: webMap.tryLockObject,
    tryUnlockObject: webMap.tryUnlockObject,
    flexGridCreated: flexGrid.flexGridCreated,
    flexGridChanged: flexGrid.flexGridChanged,
    flexGridDeleted: flexGrid.flexGridDeleted,
    fixFlexGridInstance: flexGrid.fixInstance,
    showDirectionNameForm: () => viewModes.viewModeEnable(directionName),
    selectDirection: flexGrid.selectDirection,
    getTopographicObjects: webMap.getTopographicObjects,
    toggleTopographicObjModal: topoObj.toggleTopographicObjModal,
    disableDrawUnit: selection.disableDrawUnit,
  }),
)(WebMapInner)
WebMapContainer.displayName = 'WebMap'

export default WebMapContainer
