import { difference, pickBy } from 'ramda'
import { print } from '../actions'
import { Print } from '../../constants'

const initState = {
  mapId: null,
  mapName: '',
  printScale: Print.PRINT_SCALES[0],
  requisites: {
    dpi: Print.DPI_TYPES[0],
    dpiAvailable: Print.DPI_TYPES,
    projectionGroup: Print.PRINT_PROJECTION_GROUP[0],
    legendEnabled: false,
    legendAvailable: false,
    legendTableType: 'right',
  },
  selectedZone: null,
  mapAvailability: {}, // хранилище ответов на запрысы о наличии номенклатурных листов
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
      const dpiAvailable = difference(
        Print.DPI_TYPES,
        Object.keys(
          pickBy((v) => v < action.selectedZone.lists.X * action.selectedZone.lists.Y, Print.DPI_TYPE_MAX_LISTS),
        ),
      )
      const requisites = { ...state.requisites, legendAvailable, dpiAvailable }
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
    case print.PRINT_MAP_AVAILABILITY: { // добавляем в хранилище ответ на запрос о существование номенклатурного листа
      const mapAvailability = { ...state.mapAvailability }
      const { gridIdRequest, gridIdUnavailable } = payload
      gridIdRequest.forEach((gridId) => {
        mapAvailability[gridId] = !gridIdUnavailable.includes(gridId)
      })
      return { ...state, mapAvailability }
    }
    default:
      return state
  }
}
