import { MERGE_FILTERS, REMOVE_FILTER, SET_FILTERS } from '../actions/filter'
import {
  MIL_SYMBOL_FILTER,
  SEARCH_FILTER,
  LOADING,
  SEARCH_TOPOGRAPHIC_FILTER,
  TOPOGRAPHIC_OBJECT_FILTER,
  LOADING_TOPOGRAPHIC_OBJECT,
} from '../../constants/filter'

const initState = {
  [SEARCH_FILTER]: '',
  [SEARCH_TOPOGRAPHIC_FILTER]: '',
  [MIL_SYMBOL_FILTER]: [ ],
  [MIL_SYMBOL_FILTER]: [ ],
  [TOPOGRAPHIC_OBJECT_FILTER]: { },
  [LOADING]: false,
  [LOADING_TOPOGRAPHIC_OBJECT]: {},
}

export default function reducer (state = initState, action) {
  const { type, payload } = action
  switch (type) {
    case SET_FILTERS : {
      const { name, value } = payload
      return { ...state, [name]: value }
    }
    case MERGE_FILTERS : {
      const { name, value, index } = payload
      const nameState = state[name]
      return Array.isArray(nameState)
        ? typeof index === 'number'
          ? { ...state, [name]: nameState.map((item, curIndex) => index === curIndex ? value : item) }
          : { ...state, [name]: [ ...nameState, value ] }
        : { ...state, [name]: { ...nameState, ...value } }
    }
    case REMOVE_FILTER : {
      const { name, value } = payload
      const selectedState = { ...state[name] }
      delete selectedState[value]
      return { ...state, [name]: selectedState }
    }
    default:
      return state
  }
}
