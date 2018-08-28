import { action } from '../../utils/services'

export const SET_ORG_STRUCTURE_UNITS = action('SET_ORG_STRUCTURE_UNITS')
export const SET_ORG_STRUCTURE_TREE = action('SET_ORG_STRUCTURE_TREE')
export const SET_ORG_STRUCTURE_FORMATION = action('SET_ORG_STRUCTURE_FORMATION')
export const SET_ORG_STRUCTURE_SELECTED_ID = action('SET_ORG_STRUCTURE_SELECTED_ID')
export const SET_ORG_STRUCTURE_FILTER_TEXT = action('SET_ORG_STRUCTURE_FILTER_TEXT')
export const EXPAND_ORG_STRUCTURE_ITEM = action('EXPAND_ORG_STRUCTURE_ITEM')

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
