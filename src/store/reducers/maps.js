import { maps } from '../actions'

const defItem = { visible: true }

export default function reducer (state = { byId: {} }, action) {
  let { byId } = state
  const { type } = action
  switch (type) {
    case maps.UPDATE_MAP: {
      const { mapData } = action
      const { mapId } = mapData
      let item = byId.hasOwnProperty(mapId) ? byId[mapId] : defItem
      item = { ...item, ...mapData }
      byId = { ...byId, [mapId]: item }
      return { byId }
    }
    case maps.DELETE_MAP: {
      const { mapId } = action
      byId = { ...byId }
      delete byId[mapId]
      return { byId }
    }
    case maps.DELETE_ALL_MAPS: {
      return { ...state, byId: {} }
    }
    default:
      return state
  }
}
