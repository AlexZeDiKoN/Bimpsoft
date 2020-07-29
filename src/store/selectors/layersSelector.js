import { createSelector } from 'reselect'
import * as R from 'ramda'
import { date } from '../../utils'
import { MapModes } from '../../constants'
import * as viewModesKeys from '../../constants/viewModesKeys'

const layersSelector = ({ layers }) => layers
const calc = (state) => state.maps.calc
const mapsById = (state) => state.maps.byId
const webMapModeSelector = ({ webMap: { mode } }) => mode
const is3DMapMode = ({ viewModes: { [viewModesKeys.map3D]: mode } }) => mode

export const layersById = (state) => state.layers.byId
export const selectedLayerId = (state) => state.layers.selectedId

export const layersByIdFromStore = createSelector(layersById, R.identity)

export const canEditSelector = createSelector(
  layersSelector,
  webMapModeSelector,
  is3DMapMode,
  ({ byId, selectedId, timelineFrom, timelineTo }, webMapMode, is3DMapMode) => {
    if (webMapMode !== MapModes.EDIT || !byId.hasOwnProperty(selectedId) || is3DMapMode) {
      return false
    }
    const { readOnly, visible, dateFor } = byId[selectedId]
    return !readOnly && visible && date.inDateRange(dateFor, timelineFrom, timelineTo)
  },
)

export const selectedLayer = createSelector(
  layersById,
  selectedLayerId,
  (layers, id) => id && layers[id],
)

export const mapId = createSelector(
  selectedLayer,
  (layer) => layer?.mapId,
)

export const signedMap = createSelector(
  mapsById,
  mapId,
  (maps, id) => id && maps && maps[id] && maps[id].signed,
)

export const mapCOP = createSelector(
  mapsById,
  mapId,
  (maps, id) => id && maps && maps[id] && maps[id].isCOP,
)

export const activeMapSelector = createSelector(
  layersSelector,
  (state) => state.print.mapId,
  ({ byId, selectedId }, printMapId) => printMapId || (selectedId && byId[selectedId] && byId[selectedId].mapId),
)

export const inICTMode = createSelector(
  activeMapSelector,
  calc,
  (activeMapId, calc) => activeMapId && calc && calc[activeMapId],
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
  },
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
  },
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
      const lLayerId = `l${layerId}`
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
      // сортировка по времени
      const lDateFor = Date.parse(layer.dateFor)
      const findIndex = map.children.findIndex((id) => lDateFor > Date.parse(layersById[id.slice(1)].dateFor))
      if (findIndex === -1) {
        map.children.push(lLayerId)
      } else if (findIndex === 0) {
        map.children.unshift(lLayerId)
      } else {
        map.children.splice(findIndex, 0, lLayerId)
      }

      byIds[lLayerId] = { ...layer, id: lLayerId, parentId: mapId, breadCrumbs: map.name + ' / ' + name }
      if (layer.visible) {
        map.visible = true
        visible = true
      }
      if (map.color !== undefined && map.color !== layer.color) {
        map.color = undefined
      }
    })
    return { byIds, roots, visible }
  },
)

export const currentMapLayers = createSelector(
  mapId,
  layersById,
  (mapId, layers) => mapId && layers
    ? Object.entries(layers)
      .map(([ key, value ]) => value.visible && value.mapId === mapId ? key : null)
      .filter((value) => value !== null)
    : [],
)

export const currentMapTargetLayers = createSelector(
  currentMapLayers,
  layersById,
  (currentMapLayers, layersById) => currentMapLayers.filter((id) => {
    const layer = layersById[id]
    return layer && !layer.formationId
  }),
)
