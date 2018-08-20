import { orgStructures } from '../actions'

const initState = {
  unitsById: [],
  relations: [],
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
    default:
      return state
  }
}
