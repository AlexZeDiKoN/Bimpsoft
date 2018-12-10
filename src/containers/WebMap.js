import { connect } from 'react-redux'
import { batchActions } from 'redux-batched-actions'
import WebMapInner from '../components/WebMap'
import { canEditSelector, visibleLayersSelector } from '../store/selectors'
import { webMap, selection, layers, orgStructures } from '../store/actions'

const WebMapContainer = connect(
  (state) => ({
    sources: state.webMap.source.sources,
    objects: state.webMap.objects,
    center: state.webMap.center,
    zoom: state.webMap.zoom,
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
  }),
  {
    onFinishDrawNewShape: (geometry) => selection.finishDrawNewShape(geometry),
    updateObjectGeometry: (id, geometry) => webMap.updateObjectGeometry(id, geometry),
    addObject: (object) => webMap.addObject(object),
    editObject: () => selection.showEditForm,
    onSelectedList: (list) => batchActions([ selection.selectedList(list), webMap.setScaleToSelection(false) ]),
    onSelectUnit: (unitID) => batchActions([
      orgStructures.setOrgStructureSelectedId(unitID),
      orgStructures.expandTreeByOrgStructureItem(unitID),
    ]),
    onChangeLayer: (layerId) => layers.selectLayer(layerId),
    showCreateForm: () => selection.showCreateForm,
    onMove: (center, zoom, isZoomChangedByUser) => {
      const batch = [
        webMap.setCenter(center, zoom),
        webMap.setScaleToSelection(false),
      ]
      isZoomChangedByUser && batch.push(webMap.setSubordinationLevelByZoom(zoom))
      return batchActions(batch)
    },
    onDropUnit: (unitID, point) => selection.newShapeFromUnit(unitID, point),
    stopMeasuring: () => webMap.setMeasure(false),
    onRemoveMarker: () => webMap.setMarker(null),
    requestAppInfo: () => webMap.getAppInfo(),
    tryLockObject: (objectId) => webMap.tryLockObject(objectId),
    tryUnlockObject: (objectId) => webMap.tryUnlockObject(objectId),
    getLockedObjects: () => dispatch(webMap.getLockedObjects()),
  },
)(WebMapInner)
WebMapContainer.displayName = 'WebMap'

export default WebMapContainer
