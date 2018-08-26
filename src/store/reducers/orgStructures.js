import { orgStructures, selection } from '../actions'

const initState = {
  unitsById: [],
  relations: [],
  formation: null,
  selectedId: null,
}

export default function reducer (state = initState, action) {
  const { type } = action
  switch (type) {
    case orgStructures.SET_ORG_STRUCTURE_UNITS: {
      const { unitsById } = action
      return { ...state, unitsById }
    }
    case orgStructures.SET_ORG_STRUCTURE_RELATIONS: {
      const { relations } = action
      return { ...state, relations }
    }
    case orgStructures.SET_ORG_STRUCTURE_FORMATION: {
      const { formation } = action
      return { ...state, formation }
    }
    case orgStructures.SET_ORG_STRUCTURE_SELECTED_ID: {
      const { selectedId } = action
      return { ...state, selectedId }
    }
    case selection.SET_SELECTION: {
      const { data } = action
      const { orgStructureId: selectedId = null } = data
      return { ...state, selectedId }
    }
    default:
      return state
  }
}
