import { action } from '../../utils/services'
import { asyncAction, maps, layers } from './index'

export const UPDATE_MAP = action('UPDATE_MAP')
export const DELETE_MAP = action('DELETE_MAP')
export const DELETE_ALL_MAPS = action('DELETE_ALL_MAPS')

export const updateMap = (mapData) => ({
  type: UPDATE_MAP,
  mapData,
})

export const deleteMap = (mapId) => ({
  type: DELETE_MAP,
  mapId,
})

export const deleteAllMaps = {
  type: DELETE_ALL_MAPS,
}

export const openMapFolder = (operationId, folderID, selectedItem = null) => asyncAction.withNotification(
  async (dispatch, getState, { api }) => {
    const content = await api.getFolderContent({ operationId, folderID })
    api.checkServerResponse(content)
    const { entities, params: { currentContainer: { type, id, name, parentId } } } = content

    switch (type) {
      case 'layer': {
        dispatch(openMapFolder(operationId, parentId, id))
        break
      }
      case 'layersFolder': {
        dispatch(maps.updateMap({ operationId, mapId: id, name }))
        const layersData = entities.map(({ id: layerId, name, dateFor }) => ({ mapId: id, layerId, name, dateFor }))
        dispatch(layers.updateLayers(layersData))
        let selectedLayer = selectedItem
        if (selectedLayer === null && entities.length > 0) {
          selectedLayer = entities[0].id
        }
        dispatch(layers.selectLayer(selectedLayer))
        break
      }
      default:
    }
  }
)
