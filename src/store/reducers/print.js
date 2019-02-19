import { print } from '../actions'
import { Print } from '../../constants'

const initState = {
  mapId: null,
  mapName: '',
  printScale: 100000,
  requisites: {
    dpi: Print.DPI_TYPES[3],
    projectionGroup: Print.PRINT_PROJECTION_GROUP[0],
  },
  selectedZone: null,
  printFiles: {},
  filesToPrint: false,
}

export default function reducer (state = initState, action) {
  const { type, payload } = action
  switch (type) {
    case print.PRINT: {
      return { ...state, mapId: action.mapId, mapName: action.name }
    }
    case print.PRINT_SCALE: {
      const printScale = +payload
      return { ...state, printScale }
    }
    case print.PRINT_REQUISITES: {
      const requisites = { ...state.requisites, ...payload }
      return { ...state, requisites }
    }
    case print.PRINT_REQUISITES_CLEAR: {
      const { requisites } = initState
      return { ...state, requisites }
    }
    case print.SELECTED_ZONE: {
      return { ...state, selectedZone: action.selectedZone }
    }
    case print.PRINT_FILE_SET: {
      const { id, message } = payload
      const { printFiles } = state
      if (message === 'sent' || (printFiles && printFiles[id])) {
        return { ...state, printFiles: { ...state.printFiles, [payload.id]: payload } }
      } else {
        return { ...state }
      }
    }
    case print.FILES_TO_PRINT: {
      return { ...state, filesToPrint: !state.filesToPrint }
    }
    case print.PRINT_FILE_REMOVE: {
      console.log(payload)
      const printFiles = { ...state.printFiles }
      delete printFiles[payload]
      return { ...state, printFiles }
    }
    default:
      return state
  }
}
