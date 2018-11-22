import { maps } from '../actions'

const defItem = { }
const initState = { byId: {}, expandedIds: {} }

export default function reducer (state = initState, action) {
  let { byId } = state
  const { type } = action
  switch (type) {
    case maps.UPDATE_MAP: {
      const { mapData } = action
      const { mapId } = mapData
      let item = byId.hasOwnProperty(mapId) ? byId[mapId] : defItem
      item = { ...item, ...mapData }
      byId = { ...byId, [mapId]: item }
      return { ...state, byId }
    }
    case maps.DELETE_MAP: {
      const { mapId } = action
      byId = { ...byId }
      delete byId[mapId]
      return { ...state, byId }
    }
    case maps.DELETE_ALL_MAPS: {
      return { ...state, byId: {} }
    }
    case maps.EXPAND_MAP: {
      const { id, expand } = action
      let { expandedIds } = state
      if (expandedIds.hasOwnProperty(id) === expand) {
        return state
      }
      expandedIds = { ...state.expandedIds }
      if (expand) {
        expandedIds[id] = true
      } else {
        delete expandedIds[id]
      }
      return { ...state, expandedIds }
    }
    default:
      return state
  }
}
