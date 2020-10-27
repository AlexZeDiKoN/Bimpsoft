import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { batchActions } from 'redux-batched-actions'
import LayersComponent from '../components/LayersComponent'
import { layers, maps, params, print, webMap } from '../store/actions'
import { layersTree, taskModeSelector, targetingModeSelector, mapCOP } from '../store/selectors'
import * as paramNames from '../constants/params'
import * as viewModesKeys from '../constants/viewModesKeys'
import * as notifications from '../store/actions/notifications'
import { catchErrors } from '../store/actions/asyncAction'
import i18n from '../i18n'

export const expandedIdsSelector = createSelector(
  (state) => state.maps.expandedIds,
  (state) => state.maps.filterText,
  (expandedIdsSource) => {
    const expandedIds = {}
    Object.keys(expandedIdsSource).forEach((key) => {
      expandedIds[`m${key}`] = true
    })
    return expandedIds
  },
)

const mapStateToProps = (store) => {
  const {
    layers: {
      selectedId: selectedLayerId,
      timelineFrom,
      timelineTo,
      backOpacity,
      hiddenOpacity,
      textFilter,
    },
    viewModes: { [viewModesKeys.map3D]: is3DMapMode },
  } = store

  const { byIds, roots, visible } = layersTree(store)
  const expandedIds = expandedIdsSelector(store)
  const isMapCOP = mapCOP(store)

  return {
    textFilter,
    expandedIds,
    byIds,
    roots,
    visible,
    selectedLayerId,
    timelineFrom,
    timelineTo,
    backOpacity,
    hiddenOpacity: taskModeSelector(store) || targetingModeSelector(store) ? 100 : hiddenOpacity,
    is3DMapMode,
    isMapCOP,
  }
}

const mapDispatchToProps = {
  onChangeMapVisibility: (mapId, visible) => layers.updateLayersByMapId(mapId, { visible }),
  onChangeMapColor: (mapId, color) => layers.updateLayersByMapId(mapId, { color }),
  onCloseMap: maps.deleteMap,
  onPrintMap: print.print,
  onUpdateMap: maps.openMapFolder,
  onUpdateLayer: webMap.updateObjectsByLayerId,
  onChangeLayerVisibility: (layerId, visible) => layers.updateLayer({ layerId, visible }),
  onChangeLayerColor: (layerId, color) => layers.updateLayer({ layerId, color }),
  onSelectLayer: layers.selectLayer,
  onChangeTimeLineFrom: layers.setTimelineFrom,
  onChangeTimeLineTo: layers.setTimelineTo,
  onChangeVisibility: (visible) => layers.updateAllLayers({ visible }),
  onChangeBackOpacity: (opacity) => batchActions([
    layers.setBackOpacity(opacity),
    params.saveParam(paramNames.MAP_BASE_OPACITY, opacity),
  ]),
  onChangeHiddenOpacity: (opacity) => async (dispatch, getState) => {
    const state = getState()
    if (taskModeSelector(state) || targetingModeSelector(state)) {
      await dispatch(notifications.push({
        type: 'warning',
        message: i18n.LAYERS_BASEMAP_OPACITY,
        description: i18n.LAYERS_INACTIVE_OPACITY_FAIL,
      }))
    } else {
      await dispatch(batchActions([
        layers.setHiddenOpacity(opacity),
        params.saveParam(paramNames.INACTIVE_LAYERS_OPACITY, opacity),
      ]))
    }
  },
  onCloseAllMaps: maps.deleteAllMaps,
  onCloseMapSections: maps.closeMapSections,
  onExpand: (key) => (dispatch) => key[0] === 'm' && dispatch(maps.toggleExpandMap(key.substr(1))),
  onFilterTextChange: layers.setFilterText,
}

export default connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps),
)(LayersComponent)
