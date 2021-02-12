import { data } from '@C4/CommonComponents'
import * as R from 'ramda'
import { layers } from '../actions'
import { isCatalogLayer } from '../../constants/catalogs'

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
      const { byId } = state
      const { layerData } = action
      const { layerId } = layerData

      const prevLayerData = byId.hasOwnProperty(layerId) ? byId[layerId] : defItem
      const nextLayerData = { ...prevLayerData, ...layerData }

      return R.assocPath([ 'byId', layerId ], nextLayerData, state)
    }
    case layers.UPDATE_LAYERS: {
      let { byId } = state
      const { layersData } = action
      byId = { ...byId }
      layersData.forEach((layerData) => {
        const { layerId } = layerData
        const isByIdsHaveLayer = Object.prototype.hasOwnProperty.call(byId, layerId)
        const isCatalogLayerData = isCatalogLayer(layerId)
        let item = isByIdsHaveLayer ? byId[layerId] : defItem
        if (!isByIdsHaveLayer && isCatalogLayerData) {
          item = { ...item, visible: false }
        }
        byId[layerId] = { ...item, ...layerData }
      })
      return { ...state, byId }
    }
    case layers.DELETE_LAYERS: {
      const { layersIds: layersIdsToDelete } = action
      return R.evolve({ byId: R.omit(layersIdsToDelete) }, state)
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
