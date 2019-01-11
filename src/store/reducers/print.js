import { merge } from 'lodash'
import { print } from '../actions'

const initState = {
  mapId: null,
  printScale: 100000,
  requisites: {},
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
    default:
      return state
  }
}
