import { batchActions } from 'redux-batched-actions'
import { APP6Code } from '@C4/MilSymbolEditor/build/model'
import { action } from '../../utils/services'
import { asyncAction } from './index'

export const SET_ORG_STRUCTURE_UNITS = action('SET_ORG_STRUCTURE_UNITS')
export const SET_ORG_STRUCTURE_TREE = action('SET_ORG_STRUCTURE_TREE')
export const SET_ORG_STRUCTURE_FORMATION = action('SET_ORG_STRUCTURE_FORMATION')
export const SET_ORG_STRUCTURE_SELECTED_ID = action('SET_ORG_STRUCTURE_SELECTED_ID')
export const SET_ORG_STRUCTURE_FILTER_TEXT = action('SET_ORG_STRUCTURE_FILTER_TEXT')
export const EXPAND_ORG_STRUCTURE_ITEM = action('EXPAND_ORG_STRUCTURE_ITEM')
export const EXPAND_TREE_BY_ORG_STRUCTURE_ITEM = action('EXPAND_TREE_BY_ORG_STRUCTURE_ITEM')
export const SET_ORG_STRUCTURE_COMMAND_POSTS = action('SET_ORG_STRUCTURE_COMMAND_POSTS')

const STATUS_OPERATING = 1
const CACHE_LIFETIME = 120
const { setHQ } = APP6Code

export const setOrgStructureUnits = (unitsById) => ({
  type: SET_ORG_STRUCTURE_UNITS,
  unitsById,
})

export const setOrgStructureCommandPosts = (commandPosts) => ({
  type: SET_ORG_STRUCTURE_COMMAND_POSTS,
  commandPosts,
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

const unitNumber = (unit) => (
  unit && typeof unit.orderNum === 'number' ? unit.orderNum : Infinity
)

const sortOrder = (a, b) => {
  const aNumber = unitNumber(a)
  const bNumber = unitNumber(b)
  return aNumber > bNumber ? 1 : aNumber < bNumber ? -1 : 0
}

const getOrgStructuresTree = (unitsById, relations, commandPosts) => {
  const byIds = {}
  const roots = []

  relations.forEach(({ unitID, parentUnitID }) => {
    const unit = unitsById && unitsById[unitID]
    if (unit) {
      byIds[unitID] = { ...unitsById[unitID], parentUnitID, children: [] }
    }
  })

  relations.forEach(({ unitID, parentUnitID, orderNum }) => {
    if (byIds.hasOwnProperty(unitID)) {
      const parent = byIds[parentUnitID]
      if (parent) {
        parent.children.push({ unitID, orderNum })
      } else {
        roots.push(unitID)
      }
    }
  })

  commandPosts.sort(sortOrder)
  for (const unit of Object.values(byIds)) {
    if (unit && unit.children && unit.children.length) {
      unit.children = unit.children.sort(sortOrder).map(({ unitID }) => unitID)
    }
  }

  commandPosts.forEach((commandPost) => {
    const { id, militaryUnitID, app6Code } = commandPost
    const parent = byIds[militaryUnitID]
    if (!app6Code && parent) {
      commandPost.app6Code = setHQ(parent.app6Code === null ? '' : parent.app6Code, true)
    }
    parent && parent.children && parent.children.unshift(id) && (byIds[commandPost.id] = commandPost)
  })

  return { byIds, roots, commandPosts }
}

const formationsCache = new Map()
let promiseFormation
let commandPosts

export const getFormationInfo = async (formationId, unitsById, milOrgApi, dispatch) => {
  const formationInfo = formationsCache.get(formationId)
  if (!formationInfo) {
    if (!promiseFormation) {
      promiseFormation = milOrgApi.generalFormation.list()
    }
    return promiseFormation.then(async (formations) => {
      const formation = formations.find((formation) => formation.id === formationId)
      const relations = await milOrgApi.militaryUnitRelation.list({ formationID: formationId })
      if (!commandPosts) {
        const fullList = await milOrgApi.militaryCommandPost.list()
        const commandPostsToSave = fullList
          .reduce((result, item) => {
            result[item.id] = true
            return result
          }, {})
        dispatch(setOrgStructureCommandPosts(commandPostsToSave))
        commandPosts = fullList.filter(({ state }) => state === STATUS_OPERATING)
      }
      const tree = getOrgStructuresTree(unitsById, relations, commandPosts)
      for (const [ , value ] of Object.entries(tree.byIds)) {
        if (typeof value.symbolData == 'object') { // Иногда вместо строки или null приходит пустой объект
          value.symbolData = null
        } else {
          value.symbolData = value.symbolData ? JSON.parse(value.symbolData) : null
        }
      }
      setTimeout(() => formationsCache.delete(formationId), CACHE_LIFETIME * 1000)
      const formationInfo = { formation, relations, tree }
      formationsCache.set(formationId, formationInfo)
      promiseFormation = undefined
      return formationInfo
    })
  }
  return formationInfo
}

const needNotReloadUnits = {}
const promiseUnits = {}
const cacheUnits = {}

export const reloadUnits = (dispatch, milOrgApi, formationId) => {
  if (!needNotReloadUnits[formationId]) {
    if (!promiseUnits[formationId]) {
      promiseUnits[formationId] = milOrgApi.getFormationUnits(formationId) // milOrgApi.militaryUnit.list()
        .then(({ payload }) => payload)
        .then((units) => {
          const result = units.reduce((acc, item) => {
            acc[item.id] = item
            return acc
          }, {})
          cacheUnits[formationId] = result
          dispatch(setOrgStructureUnits(result))
          return result
        })
        .then((result) => {
          delete promiseUnits[formationId]
          needNotReloadUnits[formationId] = true
          setTimeout(() => delete needNotReloadUnits[formationId], CACHE_LIFETIME * 1000)
          return result
        })
    }
    return cacheUnits[formationId] || promiseUnits[formationId]
  } else {
    dispatch(setOrgStructureUnits(cacheUnits[formationId]))
    return cacheUnits[formationId]
  }
}

export const setFormationById = (formationId) =>
  asyncAction.withNotification(async (dispatch, _, { milOrgApi }) => {
    if (!formationId) {
      dispatch(batchActions([
        setOrgStructureFormation(null),
        setOrgStructureTree({}, []),
      ]))
    } else {
      const unitsById = await reloadUnits(dispatch, milOrgApi, formationId)
      const { formation, tree } = await getFormationInfo(formationId, unitsById, milOrgApi, dispatch)
      dispatch(batchActions([
        setOrgStructureFormation(formation),
        setOrgStructureTree(tree.byIds, tree.roots),
      ]))
    }
  })
