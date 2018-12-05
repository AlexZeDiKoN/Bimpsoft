import { data, utils } from '@DZVIN/CommonComponents'
import { orgStructures, selection } from '../actions'

const { TextFilter } = data
const { getPathFunc } = utils.collection

const getPath = getPathFunc((item) => item.id, (item) => item.id, (item) => item.parentUnitID)

const initState = {
  unitsById: null,
  byIds: {},
  roots: [],
  formation: null,
  selectedId: null,
  textFilter: null,
  expandedIds: {},
}

export default function reducer (state = initState, action) {
  const { type } = action
  switch (type) {
    case orgStructures.SET_ORG_STRUCTURE_UNITS: {
      const { unitsById } = action
      return { ...state, unitsById }
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
    case orgStructures.SET_ORG_STRUCTURE_FILTER_TEXT: {
      const { filterText } = action
      const textFilter = TextFilter.create(filterText)
      return { ...state, textFilter }
    }
    default:
      return state
  }
}
