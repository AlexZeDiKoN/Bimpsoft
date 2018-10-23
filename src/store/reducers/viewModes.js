import * as actions from '../actions/viewModes'
import * as selectionActions from '../actions/selection'
import * as viewModesKeys from '../../constants/viewModesKeys'

const initialState = {
  [viewModesKeys.text]: false,
  [viewModesKeys.print]: false,
  [viewModesKeys.sidebar]: true,
  [viewModesKeys.mapSourcesList]: false,
  [viewModesKeys.searchEmpty]: false,
  [viewModesKeys.searchResult]: null,
  [viewModesKeys.searchOptions]: null,
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
    case selectionActions.SET_SELECTION: {
      return { ...state, [viewModesKeys.pointSignsList]: false }
    }
    case actions.SEARCH_PLACE: {
      const { payload } = action
      switch (payload.length) {
        case 0:
          return { ...state, searchEmpty: true, searchResult: null, searchOptions: null }
        case 1:
          return { ...state, searchEmpty: false, searchResult: payload[0], searchOptions: null }
        default:
          return { ...state, searchEmpty: false, searchResult: null, searchOptions: payload }
      }
    }
    case actions.SEARCH_SELECT_OPTION: {
      const { payload: index } = action
      return {
        ...state,
        searchEmpty: false,
        searchResult: index >= 0 ? state.searchOptions[index] : null,
        searchOptions: null,
      }
    }
    case actions.SEARCH_COORDINATES: {
      const { payload } = action
      return { ...state, searchEmpty: false, searchResult: payload, searchOptions: null }
    }
    case actions.SEARCH_CLEAR_ERROR:
      return { ...state, searchEmpty: false }
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
