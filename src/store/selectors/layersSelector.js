import { createSelector } from 'reselect'
import { date } from '../../utils'

export const canEditSelector = createSelector(
  (state) => state.layers,
  ({ editMode, byId, selectedId, timelineFrom, timelineTo }) => {
    if (!editMode || !byId.hasOwnProperty(selectedId)) {
      return false
    }
    const { readOnly, visible, dateFor } = byId[selectedId]
    return !readOnly && visible && date.inDateRange(dateFor, timelineFrom, timelineTo)
  }
)

export const activeMapSelector = createSelector(
  (state) => state.layers,
  ({ byId, selectedId }) => selectedId && byId[selectedId] && byId[selectedId].mapId
)

export const inTimeRangeLayers = createSelector(
  (state) => state.layers.byId,
  (state) => state.layers.timelineFrom,
  (state) => state.layers.timelineTo,
  (byId, timelineFrom, timelineTo) => {
    const result = {}
    for (const layer of Object.values(byId)) {
      const { layerId, dateFor } = layer
      if (date.inDateRange(dateFor, timelineFrom, timelineTo)) {
        result[layerId] = layer
      }
    }
    return result
  }
)

export const visibleLayersSelector = createSelector(
  inTimeRangeLayers,
  (byId) => {
    const result = {}
    for (const layer of Object.values(byId)) {
      const { layerId, visible } = layer
      if (visible) {
        result[layerId] = layer
      }
    }
    return result
  }
)

export const layersTree = createSelector(
  inTimeRangeLayers,
  (state) => state.maps.byId,
  (layersById, mapsById) => {
    let visible = false
    const byIds = {}
    const roots = []
    Object.values(layersById).forEach((layer) => {
      let { mapId, layerId, name } = layer
      mapId = `m${mapId}`
      layerId = `l${layerId}`
      let map = byIds[mapId]
      if (!map) {
        const mapCommonData = mapsById[layer.mapId]
        if (!mapCommonData) {
          return
        }
        const { breadcrumbs } = mapCommonData
        const breadCrumbs = breadcrumbs ? breadcrumbs.map((item) => item.name).join(' / ') : ''
        map = { ...mapCommonData, id: mapId, breadCrumbs, children: [], visible: false, color: layer.color }
        byIds[mapId] = map
        roots.push(mapId)
      }
      map.children.push(layerId)
      byIds[layerId] = { ...layer, id: layerId, parentId: mapId, breadCrumbs: map.breadCrumbs + ' / ' + name }
      if (layer.visible) {
        map.visible = true
        visible = true
      }
      if (map.color !== undefined && map.color !== layer.color) {
        map.color = undefined
      }
    })
    return { byIds, roots, visible }
  }
)
