import { connect } from 'react-redux'
import LayersComponent from '../components/LayersComponent'
import { layers, maps } from '../store/actions'

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
      visible,
      backOpacity,
      hiddenOpacity,
    },
  } = store
  const layersInMap = new Map()
  Object.values(layersById).forEach((layer) => {
    const layers = layersInMap.get(layer.mapId)
    if (Array.isArray(layers)) {
      layers.push(layer)
    } else {
      layersInMap.set(layer.mapId, [ layer ])
    }
    return layersInMap
  })
  const maps = Object.values(mapsById).map((map) => ({ ...map, items: layersInMap.get(map.mapId) }))

  return { maps, selectedLayerId, timelineFrom, timelineTo, visible, backOpacity, hiddenOpacity }
}

const mapDispatchToProps = (dispatch) => ({
  onChangeMapVisibility: (mapId, visible) => dispatch(maps.updateMap({ mapId, visible })),
  onCloseMap: (mapId) => dispatch(maps.deleteMap(mapId)),
  onChangeLayerVisibility: (layerId, visible) => dispatch(layers.updateLayer({ layerId, visible })),
  onChangeLayerColor: (layerId, color) => dispatch(layers.updateLayer({ layerId, color })),
  onSelectLayer: (layerId) => dispatch(layers.selectLayer(layerId)),
  onChangeTimeLineFrom: (date) => dispatch(layers.setTimelineFrom(date)),
  onChangeTimeLineTo: (date) => dispatch(layers.setTimelineTo(date)),
  onChangeVisibility: (visible) => dispatch(layers.setVisible(visible)),
  onChangeBackOpacity: (opacity) => dispatch(layers.setBackOpacity(opacity)),
  onChangeHiddenOpacity: (opacity) => dispatch(layers.setHiddenOpacity(opacity)),
  onCloseAllMaps: () => dispatch(maps.deleteAllMaps()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayersComponent)
