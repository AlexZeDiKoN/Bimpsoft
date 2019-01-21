import { merge } from 'lodash'
import { print } from '../actions'

const initState = {
  // TODO: замінити на null
  mapId: '5c1117ac707a1315a1000001',
  printScale: 100000,
  requisites: {},
  selectedZone: null,
}

export default function reducer (state = initState, action) {
  const { type, payload } = action
  switch (type) {
    case print.PRINT: {
      return { ...state, mapId: action.mapId }
    }
    case print.PRINT_SCALE: {
      const printScale = +payload
      return { ...state, printScale }
    }
    case print.PRINT_REQUISITES: {
      const requisites = merge(state.requisites, action.payload)
      return { ...state, requisites }
    }
    case print.PRINT_REQUISITES_CLEAR: {
      const requisites = {}
      return { ...state, requisites }
    }
    case print.SELECTED_ZONE: {
      return { ...state, selectedZone: action.selectedZone }
    }
    default:
      return state
  }
}
