import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import LayersComponent from '../components/LayersComponent'
import { layers, maps } from '../store/actions'
import { layersTree } from '../store/selectors'

export const expandedIdsSelector = createSelector(
  (state) => state.maps.expandedIds,
  (state) => state.maps.filterText,
  (expandedIdsSource) => {
    const expandedIds = {}
    Object.keys(expandedIdsSource).forEach((key) => {
      expandedIds[`m${key}`] = true
    })
    return expandedIds
  }
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
  } = store

  const { byIds, roots, visible } = layersTree(store)
  const expandedIds = expandedIdsSelector(store)
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
    hiddenOpacity,
  }
}

const mapDispatchToProps = (dispatch) => ({
  onChangeMapVisibility: (mapId, visible) => dispatch(layers.updateLayersByMapId(mapId, { visible })),
  onChangeMapColor: (mapId, color) => dispatch(layers.updateLayersByMapId(mapId, { color })),
  onCloseMap: (mapId) => dispatch(maps.deleteMap(mapId)),
  onChangeLayerVisibility: (layerId, visible) => dispatch(layers.updateLayer({ layerId, visible })),
  onChangeLayerColor: (layerId, color) => dispatch(layers.updateLayer({ layerId, color })),
  onSelectLayer: (layerId) => dispatch(layers.selectLayer(layerId)),
  onChangeTimeLineFrom: (date) => dispatch(layers.setTimelineFrom(date)),
  onChangeTimeLineTo: (date) => dispatch(layers.setTimelineTo(date)),
  onChangeVisibility: (visible) => dispatch(layers.updateAllLayers({ visible })),
  onChangeBackOpacity: (opacity) => dispatch(layers.setBackOpacity(opacity)),
  onChangeHiddenOpacity: (opacity) => dispatch(layers.setHiddenOpacity(opacity)),
  onCloseAllMaps: () => dispatch(maps.deleteAllMaps()),
  onExpand: (key) => key[0] === 'm' && dispatch(maps.toggleExpandMap(key.substr(1))),
  onFilterTextChange: (filterText) => dispatch(layers.setFilterText(filterText)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayersComponent)
