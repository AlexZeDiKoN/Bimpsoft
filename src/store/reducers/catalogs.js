import { data } from '@C4/CommonComponents'
import { catalogs } from '../actions'
import { alwaysArray } from '../../utils/always'

const { getNormilizeTree } = data

const DEFAULT_OBJECT = Object.freeze({})

const initState = {
  attributes: {},
  contacts: {},
  errors: DEFAULT_OBJECT,
  topographicPreview: [],
  catalogMeta: {
    mapId: '',
    layers: DEFAULT_OBJECT,
  },
  topographicObjectsData: {
    byIds: {},
    expandedKeys: {},
  },
}

export default function reducer (state = initState, action) {
  const { type, payload } = action
  switch (type) {
    case catalogs.CATALOG_SET_TOPOGRAPHIC_FIELDS: {
      const treeData = getNormilizeTree(payload ?? [])
      return { ...state, topographicObjectsData: { ...state.topographicObjectsData, byIds: treeData.byIds } }
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
    case catalogs.CATALOG_SET_TOPOGRAPHIC_PREVIEW:
      return { ...state, topographicPreview: payload }
    case catalogs.CATALOG_SET_CONTACT_NAME:
      return { ...state, contacts: { ...state.contacts, ...payload } }
    case catalogs.CATALOG_SET_META:
      return {
        ...state,
        catalogMeta: Object.assign(
          {},
          payload,
          { layers: Object.fromEntries(alwaysArray(payload?.layers).map((item) => [ item.layer, item ])) },
        ),
      }
    case catalogs.CATALOG_TOGGLE_EXPAND_TOPOGRAPHIC: {
      const expandedKeys = { ...state.topographicObjectsData.expandedKeys }
      const { id, status } = payload
      if (typeof status === 'boolean' ? !status : id in expandedKeys) {
        delete expandedKeys[id]
      } else {
        expandedKeys[id] = true
      }
      return { ...state, topographicObjectsData: { ...state.topographicObjectsData, expandedKeys } }
    }
    default:
      return state
  }
}
