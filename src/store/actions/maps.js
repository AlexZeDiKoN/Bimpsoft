import { action } from '../../utils/services'
import { updateColorByLayerId } from './layers'
import { asyncAction, maps, layers, webMap } from './index'

export const UPDATE_MAP = action('UPDATE_MAP')
export const DELETE_MAP = action('DELETE_MAP')
export const DELETE_ALL_MAPS = action('DELETE_ALL_MAPS')
export const EXPAND_MAP = action('EXPAND_MAP')

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

export const openMapFolder = (mapId, layerId = null) => asyncAction.withNotification(
  async (dispatch, _, { explorerApi: { getMap } }) => {
    const content = await getMap(mapId)
    const {
      layers: entities,
      map: {
        id, name,
      },
      breadcrumbs,
    } = content

    await dispatch(maps.updateMap({ mapId: id, name, breadcrumbs }))
    const layersData = entities.map(({ id, id_map, name, date_for, id_formation, readOnly }) => ({ // eslint-disable-line camelcase
      mapId: id_map,
      layerId: id,
      name,
      dateFor: date_for,
      formationId: id_formation,
      readOnly,
    }))
    await dispatch(layers.updateLayers(layersData))
    for (const { layerId } of layersData) {
      await dispatch(webMap.updateObjectsByLayerId(layerId))
      await dispatch(updateColorByLayerId(layerId))
    }
    if (layersData.length > 0) {
      let selectedLayer
      if (layerId === null) {
        selectedLayer = layersData[0]
      } else {
        selectedLayer = layersData.find(({ id }) => id === layerId)
      }
      if (selectedLayer) {
        dispatch(layers.selectLayer(selectedLayer.layerId))
      }
    }
  }
)

export const expandMap = (id, expand) => ({
  type: EXPAND_MAP,
  id,
  expand,
})

export const toggleExpandMap = (id) =>
  (dispatch, getState) => dispatch(expandMap(id, !getState().maps.expandedIds.hasOwnProperty(id)))
