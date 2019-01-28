import { merge } from 'lodash'
import { print, printToFile } from '../actions'
import { Print } from '../../constants'

const initState = {
  mapId: null,
  printScale: 100000,
  requisites: {
    dpi: Print.DPI_TYPES[3],
    coordinatesType: Print.PRINT_COORDINATES_TYPES[0],
  },
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
    case printToFile.PRINT_FILE_SET: {
      return { ...state, printFiles: { ...state.printFiles, [payload.id]: payload } }
    }
    case printToFile.PRINT_FILE_REMOVE: {
      const printFiles = { ...state.printFiles }
      delete printFiles[payload]
      return { ...state, printFiles }
    }
    default:
      return state
  }
}
