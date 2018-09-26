import { action } from '../../utils/services'
import { ApiError } from '../../constants/errors'
import i18n from '../../i18n'
import { asyncAction, maps, layers } from './index'

export const UPDATE_MAP = action('UPDATE_MAP')
export const DELETE_MAP = action('DELETE_MAP')
export const DELETE_ALL_MAPS = action('DELETE_ALL_MAPS')

export const updateMap = (mapData) => ({
  type: UPDATE_MAP,
  mapData,
})

export const deleteMap = (mapId) => asyncAction.withNotification(
  async (dispatch) => {
    dispatch({
      type: DELETE_MAP,
      mapId,
    })
    dispatch(layers.deleteLayersByMapId(mapId))
  }
)

export const deleteAllMaps = () => asyncAction.withNotification(
  async (dispatch) => {
    dispatch({
      type: DELETE_ALL_MAPS,
    })
    dispatch(layers.deleteAllLayers())
  }
)

export const openMapFolder = (operationId, folderID, selectedItem = null) => asyncAction.withNotification(
  async (dispatch, _, { api }) => {
    const content = await api.getFolderContent({ operationId, folderID })
    api.checkServerResponse(content)
    const {
      entities,
      params: {
        currentContainer: {
          type, id, name, parentId, formationId, /* dateFor, */
        },
      },
    } = content

    switch (type) {
      case 'layer': {
        if (parentId === null) {
          throw new ApiError(i18n.CANNOT_OPEN_LAYER_WO_PARENT)
          // dispatch(maps.updateMap({ operationId, mapId: id, name }))
          // const layersData = [ { mapId: null, layerId: id, name, dateFor, formationId } ]
          // dispatch(layers.updateLayers(layersData))
          // const selectedLayer = +folderID
          // dispatch(layers.selectLayer(selectedLayer))
        } else if (formationId === null) {
          throw new ApiError(i18n.CANNOT_OPEN_LAYER_WO_FORMATION)
        } else {
          dispatch(openMapFolder(operationId, parentId, id))
        }
        break
      }
      case 'layersFolder': {
        dispatch(maps.updateMap({ operationId, mapId: id, name }))
        const layersData = entities.map(({ id: folderID, entityId: layerId, name, dateFor, formationId, readOnly }) =>
          ({ mapId: id, layerId, name, dateFor, formationId, folderID, readOnly })
        )
        dispatch(layers.updateLayers(layersData))
        if (layersData.length > 0) {
          let selectedLayer
          if (selectedItem === null) {
            selectedLayer = layersData[0]
          } else {
            selectedLayer = layersData.find((layerData) => layerData.folderID === selectedItem)
          }
          if (selectedLayer) {
            dispatch(layers.selectLayer(selectedLayer.layerId))
          }
        }

        break
      }
      default:
    }
  }
)
