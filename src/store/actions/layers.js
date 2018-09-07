import { action } from '../../utils/services'
import { asyncAction, orgStructures, webMap } from './index'

export const UPDATE_LAYERS = action('UPDATE_LAYERS')
export const UPDATE_LAYER = action('UPDATE_LAYER')
export const DELETE_LAYERS = action('DELETE_LAYERS')
export const DELETE_ALL_LAYERS = action('DELETE_ALL_LAYERS')
export const SELECT_LAYER = action('SELECT_LAYER')
export const SET_TIMELINE_FROM = action('SET_TIMELINE_FROM')
export const SET_TIMELINE_TO = action('SET_TIMELINE_TO')
export const SET_VISIBLE = action('SET_VISIBLE')
export const SET_BACK_OPACITY = action('SET_BACK_OPACITY')
export const SET_HIDDEN_OPACITY = action('SET_HIDDEN_OPACITY')

const getOrgStructuresTree = (unitsById, relations) => {
  const byIds = {}
  const roots = []
  relations.forEach(({ unitID, parentUnitID }) => {
    const unit = unitsById[unitID]
    if (unit) {
      byIds[unitID] = { ...unitsById[unitID], parentUnitID, children: [] }
    }
  })
  relations.forEach(({ unitID, parentUnitID }) => {
    if (byIds.hasOwnProperty(unitID)) {
      const parent = byIds[parentUnitID]
      if (parent) {
        parent.children.push(unitID)
      } else {
        roots.push(unitID)
      }
    }
  })
  return { byIds, roots }
}

export const updateLayers = (layersData) => ({
  type: UPDATE_LAYERS,
  layersData,
})

export const updateLayer = (layerData) =>
  asyncAction.withNotification(async (dispatch, _, { api, webmapApi }) => {
    dispatch({
      type: UPDATE_LAYER,
      layerData,
    })
    if (layerData.hasOwnProperty('color')) {
      await webmapApi.layerSetColor(layerData.layerId, layerData.color)
    }
  })

export const updateColorByLayerId = (layerId) =>
  asyncAction.withNotification(async (dispatch, _, { api, webmapApi }) => {
    const data = await webmapApi.layerGetColor(layerId)
    api.checkServerResponse(data)
    const layerData = { layerId, color: data.color }
    dispatch({
      type: UPDATE_LAYER,
      layerData,
    })
  })

export const selectLayer = (layerId) =>
  asyncAction.withNotification(async (dispatch, getState, { api, webmapApi, milOrg }) => {
    const state = getState()
    const layersIds = Object.keys(state.layers.byId)

    dispatch({
      type: SELECT_LAYER,
      layerId,
    })

    if (layerId) {
      for (const layerId of layersIds) {
        await dispatch(webMap.updateObjectsByLayerId(layerId))
        await dispatch(updateColorByLayerId(Number(layerId)))
      }

      const state = getState()
      const layer = state.layers.byId[layerId]
      const { formationId = null } = layer
      if (formationId === null) {
        throw Error('org structure id is undefined')
      }

      const formations = await milOrg.generalFormation.list()
      const formation = formations.find((formation) => formation.id === formationId)
      dispatch(orgStructures.setOrgStructureFormation(formation))

      const units = await milOrg.militaryUnit.list()
      const unitsById = {}
      units.forEach((item) => {
        unitsById[item.id] = item
      })
      dispatch(orgStructures.setOrgStructureUnits(unitsById))

      const relations = await milOrg.militaryUnitRelation.list({ formationID: formationId })
      const tree = getOrgStructuresTree(unitsById, relations)

      dispatch(orgStructures.setOrgStructureTree(tree.byIds, tree.roots))
    } else {
      dispatch(orgStructures.setOrgStructureFormation(null))
      dispatch(orgStructures.setOrgStructureTree({}, []))
    }
  })

export const deleteLayersByMapId = (mapId) =>
  asyncAction.withNotification(async (dispatch, getState) => {
    const state = getState()
    const { byId } = state.layers

    const layersIds = Object.values(byId).filter((layer) => layer.mapId === mapId).map((layer) => layer.layerId)

    dispatch(deleteLayers(layersIds))
  })

export const deleteLayers = (layersIds) =>
  asyncAction.withNotification(async (dispatch, getState, { api, webmapApi, milOrg }) => {
    const state = getState()
    const { selectedId } = state.layers

    dispatch({
      type: DELETE_LAYERS,
      layersIds,
    })

    if (layersIds.includes(selectedId)) {
      dispatch(selectLayer(null))
    }

    for (const layerId of layersIds) {
      dispatch(webMap.allocateObjectsByLayerId(layerId))
    }
  })

export const deleteAllLayers = () =>
  asyncAction.withNotification(async (dispatch, getState, { api, webmapApi, milOrg }) => {
    const state = getState()
    const { byId } = state.layers
    const layersIds = Object.keys(byId)
    for (const layerId of layersIds) {
      dispatch(webMap.allocateObjectsByLayerId(layerId))
    }
    dispatch({ type: DELETE_ALL_LAYERS })
    dispatch(selectLayer(null))
  })

export const setTimelineFrom = (date) => ({
  type: SET_TIMELINE_FROM,
  date,
})

export const setTimelineTo = (date) => ({
  type: SET_TIMELINE_TO,
  date,
})

export const setVisible = (visible) => ({
  type: SET_VISIBLE,
  visible,
})

export const setBackOpacity = (opacity) => ({
  type: SET_BACK_OPACITY,
  opacity,
})

export const setHiddenOpacity = (opacity) => ({
  type: SET_HIDDEN_OPACITY,
  opacity,
})
