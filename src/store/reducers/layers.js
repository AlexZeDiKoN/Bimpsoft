import { data } from '@DZVIN/CommonComponents'
import { layers } from '../actions'

const { TextFilter } = data
const defItem = { visible: true, locked: false, color: null, readOnly: true }

const initState = {
  byId: {},
  textFilter: null,
  selectedId: null,
  timelineFrom: null,
  timelineTo: null,
  backOpacity: 100,
  hiddenOpacity: 10,
}

export default function reducer (state = initState, action) {
  const { type } = action
  switch (type) {
    case layers.SELECT_LAYER: {
      const { layerId } = action
      return { ...state, selectedId: layerId }
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
        const { layerId } = layerData
        const item = byId.hasOwnProperty(layerId) ? byId[layerId] : defItem
        byId[layerId] = { ...item, ...layerData }
      })
      return { ...state, byId }
    }
    case layers.DELETE_LAYERS: {
      let { byId } = state
      const { layersIds } = action
      byId = { ...byId }
      layersIds.forEach((layerId) => {
        delete byId[layerId]
      })
      return { ...state, byId }
    }
    case layers.DELETE_ALL_LAYERS: {
      return { ...state, byId: {} }
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
    case layers.SET_HIDDEN_OPACITY: {
      const { opacity } = action
      return { ...state, hiddenOpacity: opacity }
    }
    case layers.SET_LAYERS_FILTER_TEXT: {
      const { filterText } = action
      return { ...state, textFilter: TextFilter.create(filterText) }
    }
    default:
      return state
  }
}
