import { orgStructures } from '../actions'

const initState = {
  byIds: {},
  roots: [],
}

export default function reducer (state = initState, action) {
  const { type } = action
  switch (type) {
    case orgStructures.SET_ORG_STRUCTURES: {
      const { data } = action
      const byIds = {}
      const roots = []
      for (const item of data) {
        byIds[item.ID] = { ...item, Childrens: null, children: [] }
      }
      for (const item of data) {
        const parent = byIds[item.ParentID]
        if (parent) {
          parent.children.push(item.ID)
        } else {
          roots.push(item.ID)
        }
      }
      return { ...state, byIds, roots }
    }
    default:
      return state
  }
}
