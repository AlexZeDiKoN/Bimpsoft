import { print } from '../actions'
import { Print } from '../../constants'

const initState = {
  mapId: null,
  mapName: '',
  printScale: Print.PRINT_SCALES[0],
  requisites: {
    dpi: Print.DPI_TYPES[0],
    projectionGroup: Print.PRINT_PROJECTION_GROUP[0],
    legendChecked: false,
    legendAvailable: false,
    legendTableType: 'right',
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
      const legendAvailable = action.selectedZone && action.selectedZone.lists.X >= Print.PRINT_LEGEND_MIN_LISTS.X &&
        action.selectedZone.lists.Y >= Print.PRINT_LEGEND_MIN_LISTS.Y
      const requisites = { ...state.requisites, legendAvailable }
      return { ...state, requisites, selectedZone: action.selectedZone }
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
      action.filesList.forEach(({
        file_id: id,
        status: message,
        map_name: name,
        document_path: documentPath,
      }) => {
        printFiles[id] = { id, message, name, documentPath }
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
