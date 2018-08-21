import { action } from '../../utils/services'

export const SET_ORG_STRUCTURE_UNITS = action('SET_ORG_STRUCTURE_UNITS')
export const SET_ORG_STRUCTURE_RELATIONS = action('SET_ORG_STRUCTURE_RELATIONS')
export const SET_ORG_STRUCTURE_FORMATION = action('SET_ORG_STRUCTURE_FORMATION')

export const setOrgStructureUnits = (unitsById) => ({
  type: SET_ORG_STRUCTURE_UNITS,
  unitsById,
})
export const setOrgStructureRelations = (relations) => ({
  type: SET_ORG_STRUCTURE_RELATIONS,
  relations,
})
export const setOrgStructureFormation = (formation) => ({
  type: SET_ORG_STRUCTURE_FORMATION,
  formation,
})
