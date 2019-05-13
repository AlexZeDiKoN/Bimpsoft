import { data } from '@DZVIN/CommonComponents'
import { catalogs } from '../actions'

const { TextFilter } = data

const catalogRoot = 35

const initState = {
  byIds: {},
  roots: [],
  selectedId: null,
  textFilter: null,
  expandedIds: {},
  objects: {},
}

export default function reducer (state = initState, action) {
  const { type, payload } = action
  switch (type) {
    case catalogs.CATALOG_SET_TREE: {
      const byIds = {}
      let roots = []
      const tree = payload
        .map(({ id, name, attributes, parent_id: parent }) => ({
          id: Number(id),
          name,
          parent: Number(parent) === catalogRoot ? null : Number(parent),
          geo: Boolean(attributes.find((attr) => attr.typeOfInput === 'geometry')),
        }))
        .filter(({ id, geo }) =>
          Number(id) !== catalogRoot &&
          (geo || payload.find(({ parent_id: parent }) => Number(parent) === id))
        )
      tree.forEach((item) => (byIds[item.id] = { ...item, children: [] }))
      tree.forEach(({ id, parent }) => ((parent && byIds[parent].children) || roots).push(id))
      roots = roots.filter((id) => byIds[id].children.length)
      if (roots.length === 1) {
        roots = byIds[roots[0]].children
      }
      return { ...state, byIds, roots }
    }
    case catalogs.CATALOG_SET_LIST: {
      const { catalogId, list } = payload
      return {
        ...state,
        objects: {
          ...state.objects,
          [catalogId]: list,
        },
      }
    }
    case catalogs.CATALOG_DROP_LIST: {
      const {
        objects: { [payload]: _, ...objects },
      } = state
      return {
        ...state,
        objects,
      }
    }
    case catalogs.CATALOG_EXPAND_ITEM: {
      const { itemId } = action
      let { expandedIds } = state
      expandedIds = { ...expandedIds }
      if (expandedIds.hasOwnProperty(itemId)) {
        delete expandedIds[itemId]
      } else {
        expandedIds[itemId] = true
      }
      return { ...state, expandedIds }
    }
    case catalogs.CATALOG_FILTER_TEXT: {
      const { filterText } = action
      const textFilter = TextFilter.create(filterText)
      return { ...state, textFilter }
    }
    case catalogs.CATALOG_SELECT_ITEM: {
      const { selectedId } = action
      return { ...state, selectedId }
    }
    default:
      return state
  }
}
