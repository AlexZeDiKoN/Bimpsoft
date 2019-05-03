import * as actions from '../actions/viewModes'
import * as viewModesKeys from '../../constants/viewModesKeys'

const initialState = {
  [viewModesKeys.text]: false,
  [viewModesKeys.print]: false,
  [viewModesKeys.sidebar]: true,
  [viewModesKeys.mapSourcesList]: false,
  [viewModesKeys.directionName]: false,
  [viewModesKeys.eternalPoint]: false,
  searchEmpty: false,
  searchOptions: null,
}

const groups = [
  [ viewModesKeys.subordinationLevel, viewModesKeys.lineSignsList, viewModesKeys.mapSourcesList ],
]

const relations = makeRelatedModes(groups)

export default function reducer (state = initialState, action) {
  const { type } = action
  switch (type) {
    case actions.VIEW_MODE_TOGGLE: {
      const { payload: name } = action
      const mode = state[name]
      const relatedModes = relations[name] || {}
      return { ...state, ...relatedModes, [name]: !mode }
    }
    case actions.VIEW_MODE_DISABLE: {
      const { payload: name } = action
      return { ...state, [name]: false }
    }
    case actions.VIEW_MODE_ENABLE: {
      const { payload: name } = action
      return { ...state, [name]: true }
    }
    case actions.SET_SEARCH_OPTIONS: {
      const { payload } = action
      return { ...state, searchOptions: payload }
    }
    case actions.SET_SEARCH_EMPTY: {
      const { payload } = action
      return { ...state, searchEmpty: payload }
    }
    default:
      return state
  }
}

function makeRelatedModes (groups) {
  const relations = {}
  groups.forEach((group) => group.forEach((key) => {
    const relation = {}
    for (const otherKey of group) {
      if (key !== otherKey) {
        relation[otherKey] = false
      }
      relations[key] = relation
    }
    group.reduce((otherKey) => key !== otherKey, {})
  }))
  return relations
}
