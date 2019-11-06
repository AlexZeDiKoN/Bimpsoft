import { batchActions } from 'redux-batched-actions'
import { APP6Code } from '@DZVIN/MilSymbolEditor/build/model'
import { action } from '../../utils/services'
import { asyncAction } from './index'

export const SET_ORG_STRUCTURE_UNITS = action('SET_ORG_STRUCTURE_UNITS')
export const SET_ORG_STRUCTURE_TREE = action('SET_ORG_STRUCTURE_TREE')
export const SET_ORG_STRUCTURE_FORMATION = action('SET_ORG_STRUCTURE_FORMATION')
export const SET_ORG_STRUCTURE_SELECTED_ID = action('SET_ORG_STRUCTURE_SELECTED_ID')
export const SET_ORG_STRUCTURE_FILTER_TEXT = action('SET_ORG_STRUCTURE_FILTER_TEXT')
export const EXPAND_ORG_STRUCTURE_ITEM = action('EXPAND_ORG_STRUCTURE_ITEM')
export const EXPAND_TREE_BY_ORG_STRUCTURE_ITEM = action('EXPAND_TREE_BY_ORG_STRUCTURE_ITEM')

const CACHE_LIFETIME = 60000
const { setHQ } = APP6Code

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

const getOrgStructuresTree = (unitsById, relations, commandPosts) => {
  const byIds = {}
  const roots = []
  relations.forEach(({ unitID, parentUnitID }) => {
    const unit = unitsById && unitsById[unitID]
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
  commandPosts.forEach((commandPost) => {
    const { id, militaryUnitID, app6Code } = commandPost
    const parent = byIds[militaryUnitID]
    if (!app6Code && parent) {
      commandPost.app6Code = setHQ(parent.app6Code, true)
    }
    parent && parent.children.unshift(id) && (byIds[commandPost.id] = commandPost)
  })
  return { byIds, roots, commandPosts }
}

const formationsCache = new Map()

export const getFormationInfo = async (formationId, unitsById, milOrgApi) => {
  let formationInfo = formationsCache.get(formationId)
  if (!formationInfo) {
    const formations = await milOrgApi.generalFormation.list()
    const formation = formations.find((formation) => formation.id === formationId)
    const relations = await milOrgApi.militaryUnitRelation.list({ formationID: formationId })
    const commandPosts = await milOrgApi.militaryCommandPost.list()
    const tree = getOrgStructuresTree(unitsById, relations, commandPosts)
    for (const id in tree.byIds) {
      const symbolData = tree.byIds[id].symbolData && JSON.parse(tree.byIds[id].symbolData)
      if (symbolData) { tree.byIds[id].symbolData = symbolData }
    }
    setTimeout(() => formationsCache.delete(formationId), CACHE_LIFETIME)
    formationInfo = { formation, relations, tree }
    formationsCache.set(formationId, formationInfo)
  }
  return formationInfo
}

let needReloadUnits = true

export const reloadUnits = async (dispatch, getState, milOrgApi) => {
  let unitsById
  if (needReloadUnits) {
    setTimeout(() => { needReloadUnits = true }, CACHE_LIFETIME)
    const units = await milOrgApi.militaryUnit.list()
    unitsById = {}
    units.forEach((item) => {
      unitsById[item.id] = item
    })
    await dispatch(setOrgStructureUnits(unitsById))
    needReloadUnits = false
  } else {
    unitsById = getState().orgStructures.unitsById
  }
  return unitsById
}

export const setFormationById = (formationId) =>
  asyncAction.withNotification(async (dispatch, getState, { milOrgApi }) => {
    if (!formationId) {
      dispatch(batchActions([
        setOrgStructureFormation(null),
        setOrgStructureTree({}, []),
      ]))
    } else {
      const unitsById = await reloadUnits(dispatch, getState, milOrgApi)
      const { formation, tree } = await getFormationInfo(formationId, unitsById, milOrgApi)
      dispatch(batchActions([
        setOrgStructureFormation(formation),
        setOrgStructureTree(tree.byIds, tree.roots),
      ]))
    }
  })
