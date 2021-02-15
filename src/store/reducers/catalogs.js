import { data } from '@C4/CommonComponents'
import { catalogs } from '../actions'

const { getNormilizeTree } = data

const DEFAULT_OBJECT = Object.freeze({})

const initState = {
  attributes: {},
  contacts: {},
  errors: DEFAULT_OBJECT,
  topographicObjectsData: {
    byIds: {},
    roots: [],
  },
}

export default function reducer (state = initState, action) {
  const { type, payload } = action
  switch (type) {
    case catalogs.CATALOG_SET_TOPOGRAPHIC_FIELDS: {
      const treeData = getNormilizeTree(payload ?? [])
      return { ...state, topographicObjectsData: { ...state.topographicObjectsData, ...treeData } }
    }
    case catalogs.CATALOG_SET_TOPOGRAPHIC_BY_IDS: {
      return { ...state, topographicObjectsData: { ...state.topographicObjectsData, byIds: payload } }
    }
    case catalogs.CATALOG_SET_ATTRIBUTES: {
      const { name, value } = payload
      return { ...state, attributes: { ...state.attributes, [name]: value } }
    }
    case catalogs.CATALOG_SET_ERRORS:
      return { ...state, errors: payload ?? DEFAULT_OBJECT }
    case catalogs.CATALOG_SET_CONTACT_NAME:
      return { ...state, contacts: { ...state.contacts, ...payload } }
    default:
      return state
  }
}
