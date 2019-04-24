import { action } from '../../utils/services'
import { batchActions } from 'redux-batched-actions'
import { asyncAction, orgStructures } from './index'

export const SET_ORG_STRUCTURE_UNITS = action('SET_ORG_STRUCTURE_UNITS')
export const SET_ORG_STRUCTURE_TREE = action('SET_ORG_STRUCTURE_TREE')
export const SET_ORG_STRUCTURE_FORMATION = action('SET_ORG_STRUCTURE_FORMATION')
export const SET_ORG_STRUCTURE_SELECTED_ID = action('SET_ORG_STRUCTURE_SELECTED_ID')
export const SET_ORG_STRUCTURE_FILTER_TEXT = action('SET_ORG_STRUCTURE_FILTER_TEXT')
export const SET_COMMAND_POSTS = action('SET_COMMAND_POSTS')
export const EXPAND_ORG_STRUCTURE_ITEM = action('EXPAND_ORG_STRUCTURE_ITEM')
export const EXPAND_TREE_BY_ORG_STRUCTURE_ITEM = action('EXPAND_TREE_BY_ORG_STRUCTURE_ITEM')

const CACHE_LIFETIME = 60000

export const setOrgStructureUnits = (unitsById) => ({
  type: SET_ORG_STRUCTURE_UNITS,
  unitsById,
})
export const setOrgStructureFormation = (formation) => ({
  type: SET_ORG_STRUCTURE_FORMATION,
  formation,
})
export const setOrgStructureSelectedId = (selectedId) => ({
  type: SET_ORG_STRUCTURE_SELECTED_ID,
  selectedId,
})
export const setOrgStructuresFilterText = (filterText) => ({
  type: SET_ORG_STRUCTURE_FILTER_TEXT,
  filterText,
})
export const expandOrgStructureItem = (id) => ({
  type: EXPAND_ORG_STRUCTURE_ITEM,
  id,
})
export const expandTreeByOrgStructureItem = (selectedId) => ({
  type: EXPAND_TREE_BY_ORG_STRUCTURE_ITEM,
  selectedId,
})
export const setOrgStructureTree = (byIds, roots) => ({
  type: SET_ORG_STRUCTURE_TREE,
  byIds,
  roots,
})

export const setCommandPosts = (commandPosts) => {
  const commandPostsById = {}
  commandPosts.forEach((item) => {
    commandPostsById[item.id] = item
  })
  return ({
    type: SET_COMMAND_POSTS,
    commandPostsById,
  })
}

const getOrgStructuresTree = (unitsById, relations, commandPosts) => {
  const byIds = {}
  const roots = []
  relations.forEach(({ unitID, parentUnitID }) => {
    const unit = unitsById[unitID]
    if (unit) {
      byIds[unitID] = { ...unitsById[unitID], parentUnitID, children: [], commandPosts: [] }
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
  commandPosts.forEach(({ id, militaryUnitID }) => {
    const parent = byIds[militaryUnitID]
    parent && parent.commandPosts.push(id)
  })
  return { byIds, roots }
}

const formationsCache = new Map()

const getFormationInfo = async (formationId, unitsById, milOrgApi) => {
  let formationInfo = formationsCache.get(formationId)
  if (!formationInfo) {
    const formations = await milOrgApi.generalFormation.list()
    const formation = formations.find((formation) => formation.id === formationId)
    const relations = await milOrgApi.militaryUnitRelation.list({ formationID: formationId })
    const commandPosts = await milOrgApi.militaryCommandPost.list({ formationID: formationId })
    const tree = getOrgStructuresTree(unitsById, relations, commandPosts)
    setTimeout(() => formationsCache.delete(formationId), CACHE_LIFETIME)
    formationInfo = { formation, relations, commandPosts, tree }
    formationsCache.set(formationId, formationInfo)
  }
  return formationInfo
}

let needReloadUnits = true

export const setFormationById = (formationId) =>
  asyncAction.withNotification(async (dispatch, getState, { milOrgApi }) => {
    if (!formationId) {
      dispatch(batchActions([
        orgStructures.setOrgStructureFormation(null),
        orgStructures.setOrgStructureTree({}, []),
        orgStructures.setCommandPosts({}),
      ]))
      // dispatch(orgStructures.setOrgStructureFormation(null))
      // dispatch(orgStructures.setOrgStructureTree({}, []))
    } else {
      let unitsById
      if (needReloadUnits) {
        needReloadUnits = false
        setTimeout(() => { needReloadUnits = true }, CACHE_LIFETIME)
        const units = await milOrgApi.militaryUnit.list()
        unitsById = {}
        units.forEach((item) => {
          unitsById[item.id] = item
        })
        dispatch(setOrgStructureUnits(unitsById))
      } else {
        unitsById = getState().orgStructures.unitsById
      }
      const { formation, commandPosts, tree } = await getFormationInfo(formationId, unitsById, milOrgApi)
      dispatch(batchActions([
        setOrgStructureFormation(formation),
        setOrgStructureTree(tree.byIds, tree.roots),
        setCommandPosts(commandPosts),
      ]))
      // dispatch(setOrgStructureFormation(formation))
      // dispatch(setOrgStructureTree(tree.byIds, tree.roots))
    }
  })
