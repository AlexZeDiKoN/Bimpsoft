import { orgStructures } from '../actions'

const initState = {
  unitsById: [],
  relations: [],
  formation: null,
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
    default:
      return state
  }
}
