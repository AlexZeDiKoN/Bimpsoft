import { createSelector } from 'reselect'
import { date } from '../../utils'

const layersSelector = ({ layers }) => layers
const calc = (state) => state.maps.calc
const selectedLayerId = (state) => state.layers.selectedId
const mapsById = (state) => state.maps.byId
const targeting = ({ targeting: { targetingMode } }) => targetingMode

export const layersById = (state) => state.layers.byId

export const canEditSelector = createSelector(
  layersSelector,
  targeting,
  ({ editMode, byId, selectedId, timelineFrom, timelineTo }, targeting) => {
    if (!editMode || !byId.hasOwnProperty(selectedId)) {
      return false
    }
    const { readOnly, visible, dateFor } = byId[selectedId]
    return !readOnly && !targeting && visible && date.inDateRange(dateFor, timelineFrom, timelineTo)
  }
)

export const selectedLayer = createSelector(
  layersById,
  selectedLayerId,
  (layers, id) => id && layers[id]
)

export const mapId = createSelector(
  selectedLayer,
  (layer) => layer && layer.mapId
)

export const signedMap = createSelector(
  mapsById,
  mapId,
  (maps, id) => id && maps && maps[id] && maps[id].signed
)

export const activeMapSelector = createSelector(
  layersSelector,
  (state) => state.print.mapId,
  ({ byId, selectedId }, printMapId) => printMapId || (selectedId && byId[selectedId] && byId[selectedId].mapId)
)

export const inICTMode = createSelector(
  activeMapSelector,
  calc,
  (activeMapId, calc) => activeMapId && calc && calc[activeMapId]
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
  activeMapSelector,
  inICTMode,
  (byId, activeMapId, variantId) => {
    const result = {}
    for (const layer of Object.values(byId)) {
      const { layerId, mapId, visible } = layer
      if (visible && (!variantId || mapId === activeMapId)) {
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
        map = {
          ...mapCommonData,
          id: mapId,
          breadCrumbs,
          children: [],
          visible: false,
          color: layer.color,
        }
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
