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

const STATUS_OPERATING = 1
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
    parent && parent.children && parent.children.unshift(id) && (byIds[commandPost.id] = commandPost)
  })
  return { byIds, roots, commandPosts }
}

const formationsCache = new Map()
let promiseFormation

export const getFormationInfo = async (formationId, unitsById, milOrgApi) => {
  const formationInfo = formationsCache.get(formationId)
  if (!formationInfo) {
    if (!promiseFormation) {
      promiseFormation = milOrgApi.generalFormation.list()
        .then(async (formations) => {
          const formation = formations.find((formation) => formation.id === formationId)
          const relations = await milOrgApi.militaryUnitRelation.list({ formationID: formationId })
          const commandPosts = (await milOrgApi.militaryCommandPost.list())
            .filter(({ state }) => state === STATUS_OPERATING)
          // console.log(commandPosts)
          const tree = getOrgStructuresTree(unitsById, relations, commandPosts)
          for (const [ , value ] of Object.entries(tree.byIds)) {
            value.symbolData = value.symbolData ? JSON.parse(value.symbolData) : null
          }
          setTimeout(() => formationsCache.delete(formationId), CACHE_LIFETIME)
          const formationInfo = { formation, relations, tree }
          formationsCache.set(formationId, formationInfo)
          promiseFormation = undefined
          return formationInfo
        })
    }
    return promiseFormation
  }
  return formationInfo
}

let needReloadUnits = true
let promiseUnits

export const reloadUnits = async (dispatch, getState, milOrgApi) => {
  if (needReloadUnits) {
    if (!promiseUnits) {
      promiseUnits = milOrgApi.militaryUnit.list()
        .then((units) => dispatch(setOrgStructureUnits(units.reduce((acc, item) => (acc[item.id] = item), {}))))
        .then((result) => {
          promiseUnits = undefined
          needReloadUnits = false
          setTimeout(() => { needReloadUnits = true }, CACHE_LIFETIME)
          return result
        })
    }
    return promiseUnits
  } else {
    return getState().orgStructures.unitsById
  }
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
