import ServerApi from '../server/api.server'
import { maps, layers } from '../store/actions'

export const OPEN_MAP_FOLDER = 'OPEN_MAP_FOLDER'

export const openMapFolder = (operationId, folderId, selectedItem = null) => ({
  type: OPEN_MAP_FOLDER,
  payload: { operationId, folderId, selectedItem },
})

export default (store) => (next) => async (action) => {
  const { type } = action

  switch (type) {
    case OPEN_MAP_FOLDER: {
      const { payload: { operationId, folderId: folderID, selectedItem } } = action
      let content
      try {
        content = await ServerApi.getFolderContent({ operationId, folderID }, store)
      } catch (error) {
        console.error(error)
        return
      }
      const { entities, params: { currentContainer: { type, id, name, parentId } } } = content

      switch (type) {
        case 'layer': {
          store.dispatch(openMapFolder(operationId, parentId, id))
          break
        }
        case 'layersFolder': {
          next(maps.updateMap({ operationId, mapId: id, name }))
          const layersData = entities.map(({ id: layerId, name, dateFor }) => ({ mapId: id, layerId, name, dateFor }))
          next(layers.updateLayers(layersData))
          let selectedLayer = selectedItem
          if (selectedLayer === null && entities.length > 0) {
            selectedLayer = entities[0].id
          }
          next(layers.selectLayer(selectedLayer))
          break
        }
      }
      break
    }
    default:
      return next(action)
  }
}
