import { connect } from 'react-redux'
import { batchActions } from 'redux-batched-actions'
import WebMapInner from '../components/WebMap'
import {
  canEditSelector, visibleLayersSelector, activeObjectId, flexGridParams, flexGridVisible, flexGridData,
  activeMapSelector, inICTMode, targetingObjects, targetingModeSelector, taskModeSelector,
} from '../store/selectors'
import { webMap, selection, layers, orgStructures, flexGrid, viewModes, targeting, task } from '../store/actions'
import {
  layersByIdFromStore,
} from '../store/selectors/layersSelector'
import { catchErrors } from '../store/actions/asyncAction'
import * as topoObj from '../store/actions/webMap'
import { directionName, eternalPoint } from '../constants/viewModesKeys'

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
    layersByIdFromStore: layersByIdFromStore(state),
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
    topographicObjects: state.webMap.topographicObjects,
    catalogObjects: state.catalogs.objects,
    catalogs: state.catalogs.byIds,
    unitsById: state.orgStructures.unitsById,
    targetingObjects: targetingObjects(state),
  }),
  catchErrors({
    onFinishDrawNewShape: selection.finishDrawNewShape,
    updateObjectGeometry: webMap.updateObjectGeometry,
    updateObjectAttributes: webMap.updateObjectAttributes,
    editObject: selection.showEditForm,
    onClick: (latlng) => (dispatch, getState) => {
      const state = getState()
      if (taskModeSelector(state)) {
        dispatch(task.showTaskByCoordinate(latlng))
      }
    },
    onSelectedList: (list) => (dispatch, getState) => {
      const state = getState()
      const actions = []
      if (targetingModeSelector(state)) {
        if (list.length > 1) {
          return
        }
        actions.push(task.addObject(list[0]))
      } else if (taskModeSelector(state)) {
        if (list.length === 1) {
          actions.push(task.showTaskByObject(list[0]))
        }
      }
      actions.push(webMap.setScaleToSelection(false))
      actions.push(selection.selectedList(list))
      dispatch(batchActions(actions))
    },
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
    showDirectionNameForm: (props) => batchActions([
      flexGrid.selectDirection(props),
      viewModes.viewModeEnable(directionName),
    ]),
    showEternalDescriptionForm: (props) => batchActions([
      flexGrid.selectEternal(props),
      viewModes.viewModeEnable(eternalPoint),
    ]),
    selectEternal: flexGrid.selectEternal,
    getTopographicObjects: webMap.getTopographicObjects,
    toggleTopographicObjModal: topoObj.toggleTopographicObjModal,
    disableDrawUnit: selection.disableDrawUnit,
    onMoveContour: webMap.moveContour,
    onMoveObjList: webMap.moveObjList,
    getZones: targeting.getZones,
  }),
)(WebMapInner)
WebMapContainer.displayName = 'WebMap'

export default WebMapContainer
