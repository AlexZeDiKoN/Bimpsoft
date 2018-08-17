import * as actions from '../actions/viewModes'
import * as viewModesKeys from '../../constants/viewModesKeys'

const initialState = {
  [viewModesKeys.edit]: false,
  [viewModesKeys.text]: false,
  [viewModesKeys.print]: false,
  [viewModesKeys.sidebar]: true,
  [viewModesKeys.mapSourcesList]: false,
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
