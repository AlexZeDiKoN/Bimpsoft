import { action } from '../../utils/services'
import { asyncAction, orgStructures } from './index'

export const SET_ORG_STRUCTURE_UNITS = action('SET_ORG_STRUCTURE_UNITS')
export const SET_ORG_STRUCTURE_TREE = action('SET_ORG_STRUCTURE_TREE')
export const SET_ORG_STRUCTURE_FORMATION = action('SET_ORG_STRUCTURE_FORMATION')
export const SET_ORG_STRUCTURE_SELECTED_ID = action('SET_ORG_STRUCTURE_SELECTED_ID')
export const SET_ORG_STRUCTURE_FILTER_TEXT = action('SET_ORG_STRUCTURE_FILTER_TEXT')
export const EXPAND_ORG_STRUCTURE_ITEM = action('EXPAND_ORG_STRUCTURE_ITEM')

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
export const setOrgStructureTree = (byIds, roots) => ({
  type: SET_ORG_STRUCTURE_TREE,
  byIds,
  roots,
})

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

const formationsCache = new Map()
const getFormationInfo = async (formationId, unitsById, milOrg) => {
  let formationInfo = formationsCache.get(formationId)
  if (!formationInfo) {
    const formations = await milOrg.generalFormation.list()
    const formation = formations.find((formation) => formation.id === formationId)
    const relations = await milOrg.militaryUnitRelation.list({ formationID: formationId })
    const tree = getOrgStructuresTree(unitsById, relations)
    setTimeout(() => formationsCache.delete(formationId), CACHE_LIFETIME)
    formationInfo = { formation, relations, tree }
    formationsCache.set(formationId, formationInfo)
  }
  return formationInfo
}

let needReloadUnits = true

export const setFormationById = (formationId) =>
  asyncAction.withNotification(async (dispatch, getState, { api, webmapApi, milOrg }) => {
    if (!formationId) {
      dispatch(orgStructures.setOrgStructureFormation(null))
      dispatch(orgStructures.setOrgStructureTree({}, []))
    } else {
      let unitsById
      if (needReloadUnits) {
        needReloadUnits = false
        setTimeout(() => { needReloadUnits = true }, CACHE_LIFETIME)
        const units = await milOrg.militaryUnit.list()
        unitsById = {}
        units.forEach((item) => {
          unitsById[item.id] = item
        })
        dispatch(setOrgStructureUnits(unitsById))
      } else {
        unitsById = getState().orgStructures.unitsById
      }
      const { formation, tree } = await getFormationInfo(formationId, unitsById, milOrg)

      dispatch(setOrgStructureFormation(formation))
      dispatch(setOrgStructureTree(tree.byIds, tree.roots))
    }
  })
