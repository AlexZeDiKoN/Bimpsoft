import { REMOVE_FILTER_CATALOG, SET_CATALOGS_FIELDS, SET_FILTER_CATALOG } from '../actions/filter'

const initState = {
  catalogFilters: { },
  catalogsFields: { },
}

export default function reducer (state = initState, action) {
  const { type, payload } = action
  switch (type) {
    case SET_FILTER_CATALOG :
      return { ...state, catalogFilters: { ...state.catalogFilters, ...payload } }
    case SET_CATALOGS_FIELDS :
      return { ...state, catalogsFields: { ...state.catalogsFields, ...payload } }
    case REMOVE_FILTER_CATALOG : {
      const catalogFilters = { ...state.catalogFilters }
      delete catalogFilters[payload]
      return { ...state, catalogFilters }
    }
    default:
      return state
  }
}
