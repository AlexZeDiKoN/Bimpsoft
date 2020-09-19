import { connect } from 'react-redux'
import { batchActions } from 'redux-batched-actions'
import WebMapInner from '../components/WebMap'
import {
  canEditSelector, visibleLayersSelector, activeObjectId, flexGridParams, flexGridVisible, flexGridData,
  activeMapSelector, inICTMode, targetingObjects, targetingModeSelector, taskModeSelector, layersByIdFromStore,
  marchDots, undoInfo, mapCOP,
} from '../store/selectors'
import {
  webMap, selection, layers, orgStructures, flexGrid, viewModes, targeting, task, groups, march,
} from '../store/actions'
import { catchErrors } from '../store/actions/asyncAction'
import { directionName, eternalPoint } from '../constants/viewModesKeys'
import { MapModes } from '../constants'
import * as notifications from '../store/actions/notifications'
import i18n from '../i18n'

const WebMapContainer = connect(
  (state) => ({
    sources: state.webMap.source.sources,
    objects: state.webMap.objects,
    center: state.webMap.center,
    zoom: state.webMap.zoom,
    highlighted: state.webMap.highlighted,
    isMarkersOn: state.webMap.isMarkersOn,
    isTopographicObjectsOn: state.webMap.isTopographicObjectsOn,
    isLoadingMap: state.maps.loadingMap,
    edit: canEditSelector(state),
    marker: state.webMap.marker,
    scaleToSelection: state.webMap.scaleToSelection,
    selection: state.selection,
    layer: state.layers.selectedId,
    level: state.webMap.subordinationLevel,
    layersByIdFromStore: layersByIdFromStore(state),
    layersById: visibleLayersSelector(state),
    backOpacity: state.layers.backOpacity,
    hiddenOpacity: targetingModeSelector(state) || taskModeSelector(state) ? 100 : state.layers.hiddenOpacity,
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
    marchMode: state.march.coordMode,
    marchDots: marchDots(state),
    marchRefPoint: state.march.coordRefPoint,
    undoInfo: undoInfo(state),
    isMapCOP: mapCOP(state),
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
      if (targetingModeSelector(state)) {
        dispatch(task.setFriendObject(null))
      }
    },
    onSelectedList: (list) => async (dispatch, getState) => {
      const state = getState()
      if (targetingModeSelector(state)) {
        if (list.length > 1) {
          return
        }
        if (list.length === 1) {
          await dispatch(task.addObject(list[ 0 ]))
        }
      } else if (taskModeSelector(state)) {
        if (list.length === 1) {
          await dispatch(task.showTaskByObject(list[0]))
          list = []
        }
      }
      await dispatch(batchActions([
        webMap.setScaleToSelection(false),
        selection.selectedList(list),
      ]))
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
    requestMapSources: webMap.getMapSources,
    getLockedObjects: webMap.getLockedObjects,
    warningLockObjectsMove: () => notifications.push({
      type: 'warning',
      message: i18n.ERROR_OBJECTS_LOCKED,
      description: i18n.ERROR_OBJECTS_LOCKED_DESCRIPTION,
    }),
    tryLockObject: webMap.tryLockObject,
    tryUnlockObject: webMap.tryUnlockObject,
    flexGridCreated: flexGrid.flexGridCreated,
    flexGridChanged: flexGrid.flexGridChanged,
    flexGridDeleted: flexGrid.flexGridDeleted,
    fixFlexGridInstance: flexGrid.fixInstance,
    showDirectionNameForm: (props) => (dispatch, getState) => {
      const state = getState()
      if (state.webMap.mode === MapModes.EDIT && !state.viewModes[directionName]) {
        dispatch(batchActions([
          flexGrid.selectDirection(props),
          viewModes.viewModeEnable(directionName),
        ]))
      }
    },
    showEternalDescriptionForm: (props) => batchActions([
      flexGrid.selectEternal(props),
      viewModes.viewModeEnable(eternalPoint),
    ]),
    selectEternal: flexGrid.selectEternal,
    getTopographicObjects: webMap.getTopographicObjects,
    toggleTopographicObjModal: webMap.toggleTopographicObjModal,
    disableDrawUnit: selection.disableDrawUnit,
    onMoveContour: webMap.moveContour,
    onMoveObjList: webMap.moveObjList,
    onMoveGroup: webMap.moveGroup,
    getZones: targeting.getZones,
    createGroup: groups.createGroup,
    dropGroup: groups.dropGroup,
    newShapeFromSymbol: selection.newShapeFromSymbol,
    newShapeFromLine: selection.newShapeFromLine,
    getCoordForMarch: march.setCoordFromMap,
    undo: webMap.undo,
    redo: webMap.redo,
    checkObjectAccess: webMap.getObjectAccess,
    onShadowDelete: webMap.removeObjects,
  }),
)(WebMapInner)
WebMapContainer.displayName = 'WebMap'

export default WebMapContainer
