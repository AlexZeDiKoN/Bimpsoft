export const UPDATE_MAP = 'UPDATE_MAP'
export const DELETE_MAP = 'DELETE_MAP'
export const DELETE_ALL_MAPS = 'DELETE_ALL_MAPS'

export const updateMap = (mapData) => ({
  type: UPDATE_MAP,
  mapData,
})
export const deleteMap = (mapId) => ({
  type: DELETE_MAP,
  mapId,
})
export const deleteAllMaps = () => ({
  type: DELETE_ALL_MAPS,
})
