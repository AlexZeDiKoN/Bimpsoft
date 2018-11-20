import { connect } from 'react-redux'
import memoizeOne from 'memoize-one'
import LayersComponent from '../components/LayersComponent'
import { layers, maps } from '../store/actions'

const getMaps = memoizeOne((layersById, mapsById) => {
  let visible = false
  const maps = new Map()
  Object.values(layersById).forEach((layer) => {
    const { mapId } = layer
    let map = maps.get(mapId)
    if (!map) {
      const mapCommonData = mapsById[mapId]
      if (!mapCommonData) {
        return
      }
      map = { ...mapCommonData, items: [], visible: false, color: layer.color }
    }
    map.items.push(layer)
    if (layer.visible) {
      map.visible = true
      visible = true
    }
    if (map.color !== undefined && map.color !== layer.color) {
      map.color = undefined
    }
    maps.set(mapId, map)
  })
  return { maps: [ ...maps.values() ], visible }
})

const mapStateToProps = (store) => {
  const {
    maps: {
      byId: mapsById,
    },
    layers: {
      byId: layersById,
      selectedId: selectedLayerId,
      timelineFrom,
      timelineTo,
      backOpacity,
      hiddenOpacity,
    },
  } = store

  const { maps, visible } = getMaps(layersById, mapsById)
  return { maps, selectedLayerId, timelineFrom, timelineTo, visible, backOpacity, hiddenOpacity }
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
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayersComponent)
