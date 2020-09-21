import { maps } from '../actions'

const defItem = {}

const initState = {
  byId: {},
  expandedIds: {},
  calc: {},
  loadingMap: false,
}

export default function reducer (state = initState, action) {
  let { byId } = state
  const { type, payload } = action
  switch (type) {
    case maps.UPDATE_MAP: {
      const { mapData } = action
      const { mapId, name, breadcrumbs, docConfirm, securityClassification, approversData, signed, isCOP } = mapData
      let item = byId.hasOwnProperty(mapId) ? byId[mapId] : defItem
      item = { ...item, mapId, name, breadcrumbs, docConfirm, securityClassification, approversData, signed, isCOP }
      byId = { ...byId, [mapId]: item }
      return { ...state, byId }
    }
    case maps.DELETE_MAP: {
      const { mapId } = action
      byId = { ...byId }
      const { refreshTimer } = (byId[mapId] || {})
      refreshTimer && clearInterval(refreshTimer)
      delete byId[mapId]
      if (!Object.keys(byId).length && global.lockRefreshTimer) {
        clearInterval(global.lockRefreshTimer)
        delete global.lockRefreshTimer
      }
      return { ...state, byId }
    }
    case maps.DELETE_ALL_MAPS: {
      Object.keys(byId).forEach((mapId) => {
        const { refreshTimer } = (byId[mapId] || {})
        refreshTimer && clearInterval(refreshTimer)
      })
      if (global.lockRefreshTimer) {
        clearInterval(global.lockRefreshTimer)
        delete global.lockRefreshTimer
      }
      return { ...state, byId: {} }
    }
    case maps.EXPAND_MAP: {
      const { id, expand } = action
      let { expandedIds } = state
      if (expandedIds.hasOwnProperty(id) === expand) {
        return state
      }
      expandedIds = { ...state.expandedIds }
      if (expand) {
        expandedIds[id] = true
      } else {
        delete expandedIds[id]
      }
      return { ...state, expandedIds }
    }
    case maps.CLOSE_MAP_SECTIONS: {
      const { mapsCollapsed } = action
      const expandedIds = {}
      if (mapsCollapsed) {
        const { byId } = state
        for (const key in byId) {
          expandedIds[byId[key].mapId] = true
        }
      }
      return { ...state, expandedIds }
    }
    case maps.SET_CALC_VARIANT: {
      let calc = { ...state.calc }
      const { mapId, variantId } = payload
      if (mapId) {
        if (!variantId && calc[mapId]) {
          delete calc[mapId]
        } else if (calc[mapId] !== variantId) {
          calc[mapId] = variantId
        }
      } else if (!variantId) {
        calc = {}
      } else {
        Object.entries(calc)
          .forEach(([ key, value ]) => {
            if (value === variantId) {
              delete calc[key]
            }
          })
      }
      return { ...state, calc }
    }
    case maps.SET_MAP_LOADING: {
      const { loadingMap = true } = action
      return { ...state, loadingMap }
    }
    default:
      return state
  }
}
