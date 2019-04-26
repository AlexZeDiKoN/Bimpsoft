import { catalogs } from '../actions'

const catalogRoot = 35

const initState = {
  byIds: {},
  roots: [],
  selectedId: null,
  textFilter: null,
  expandedIds: {},
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
    default:
      return state
  }
}
