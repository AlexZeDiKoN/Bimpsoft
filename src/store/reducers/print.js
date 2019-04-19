import { print } from '../actions'
import { Print } from '../../constants'

const initState = {
  mapId: null,
  mapName: '',
  printScale: 100000,
  requisites: {
    dpi: Print.DPI_TYPES[0],
    projectionGroup: Print.PRINT_PROJECTION_GROUP[0],
    legendTableType: 'left',
  },
  selectedZone: null,
  printFiles: {},
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
      if (message === Print.PRINT_STEPS.SENT || printFiles[id]) {
        payload.name = payload.name || state.printFiles[payload.id].name
        return { ...state, printFiles: { ...state.printFiles, [payload.id]: payload } }
      } else {
        return { ...state }
      }
    }
    case print.PRINT_FILE_LOG: {
      const printFiles = {}
      action.filesList.forEach(({ file_id: id, status: message, map_name: name }) => {
        printFiles[id] = { id, message, name }
      })
      return { ...state, printFiles }
    }
    case print.PRINT_FILE_REMOVE: {
      const printFiles = { ...state.printFiles }
      delete printFiles[payload]
      return { ...state, printFiles }
    }
    default:
      return state
  }
}
