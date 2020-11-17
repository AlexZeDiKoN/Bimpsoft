import { data, utils } from '@C4/CommonComponents'
import { orgStructures } from '../actions'

const { TextFilter } = data
const { getPathFunc } = utils.collection

const getPath = getPathFunc((item) => item.id, (item) => item.id, (item) => item.parentUnitID || item.militaryUnitID)

const initState = {
  unitsById: null,
  byIds: {},
  roots: [],
  formation: null,
  selectedId: null,
  textFilter: null,
  expandedIds: {},
  commandPosts: {},
}

export default function reducer (state = initState, action) {
  const { type } = action
  switch (type) {
    case orgStructures.SET_ORG_STRUCTURE_UNITS: {
      const { unitsById } = action
      return { ...state, unitsById }
    }
    case orgStructures.SET_ORG_STRUCTURE_COMMAND_POSTS: {
      const { commandPosts } = action
      return { ...state, commandPosts }
    }
    case orgStructures.SET_ORG_STRUCTURE_TREE: {
      const { byIds, roots } = action
      return { ...state, byIds, roots }
    }
    case orgStructures.SET_ORG_STRUCTURE_FORMATION: {
      const { formation } = action
      return { ...state, formation }
    }
    case orgStructures.SET_ORG_STRUCTURE_SELECTED_ID: {
      const { selectedId } = action
      return { ...state, selectedId }
    }
    case orgStructures.EXPAND_ORG_STRUCTURE_ITEM: {
      const { id } = action
      let { expandedIds } = state
      expandedIds = { ...expandedIds }
      if (expandedIds.hasOwnProperty(id)) {
        delete expandedIds[id]
      } else {
        expandedIds[id] = true
      }
      return { ...state, expandedIds }
    }
    case orgStructures.EXPAND_TREE_BY_ORG_STRUCTURE_ITEM: {
      const { selectedId } = action
      if (selectedId !== null) {
        const selectedIds = getPath(state.byIds, selectedId).slice(0, -1)
        if (selectedIds.length) {
          const expandedIds = { ...state.expandedIds }
          selectedIds.forEach((selectedId) => { expandedIds[selectedId] = true })
          return { ...state, expandedIds }
        }
      }
      return state
    }
    case orgStructures.SET_ORG_STRUCTURE_FILTER_TEXT: {
      const { filterText } = action
      const textFilter = TextFilter.create(filterText)
      return { ...state, textFilter }
    }
    default:
      return state
  }
}
