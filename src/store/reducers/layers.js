import { layers, maps } from '../actions'

const defItem = { visible: true, locked: false, color: null, shared: false }
const initState = {
  byId: {},
  selectedId: null,
  timelineFrom: null,
  timelineTo: null,
  visible: true,
  backOpacity: 100,
  hiddenOpacity: 10,
}
export default function reducer (state = initState, action) {
  const { type } = action
  switch (type) {
    case layers.SELECT_LAYER: {
      const { byId } = state
      const { layerId } = action
      if (byId.hasOwnProperty(layerId)) {
        return { ...state, selectedId: layerId }
      }
      return state
    }
    case layers.UPDATE_LAYER: {
      let { byId } = state
      const { layerData } = action
      const { layerId } = layerData
      let item = byId.hasOwnProperty(layerId) ? byId[layerId] : defItem
      item = { ...item, ...layerData }
      byId = { ...byId, [layerId]: item }
      return { ...state, byId }
    }
    case layers.UPDATE_LAYERS: {
      let { byId } = state
      const { layersData } = action
      byId = { ...byId }
      layersData.forEach((layerData) => {
        const { operationId, layerId, mapId, name, formationId } = layerData
        let item = byId.hasOwnProperty(layerId) ? byId[layerId] : defItem
        item = { ...item, operationId, mapId, layerId, name, formationId }
        byId[layerId] = item
      })
      return { ...state, byId }
    }
    case maps.DELETE_MAP: {
      let { byId, selectedId } = state
      const { mapId } = action
      const newBiId = {}
      Object.keys(byId).forEach((key) => {
        const item = byId[key]
        if (item.mapId === mapId) {
          if (selectedId === item.layerId) {
            selectedId = null
          }
        } else {
          newBiId[key] = item
        }
      })
      return { ...state, byId: newBiId, selectedId }
    }
    case maps.DELETE_ALL_MAPS: {
      return { ...state, byId: {}, selectedId: null }
    }
    case layers.SET_TIMELINE_FROM: {
      const { date } = action
      return { ...state, timelineFrom: date }
    }
    case layers.SET_TIMELINE_TO: {
      const { date } = action
      return { ...state, timelineTo: date }
    }
    case layers.SET_BACK_OPACITY: {
      const { opacity } = action
      return { ...state, backOpacity: opacity }
    }
    case layers.SET_VISIBLE: {
      const { visible } = action
      return { ...state, visible }
    }
    case layers.SET_HIDDEN_OPACITY: {
      const { opacity } = action
      return { ...state, hiddenOpacity: opacity }
    }
    default:
      return state
  }
}
