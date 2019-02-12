import { batchActions } from 'redux-batched-actions'
import { action } from '../../utils/services'
import { getUSC2000Projection } from '../../utils/projection'
import { getMapObjectsSvg } from '../../utils/svg/mapObjects'
import { PRINT_ZONE_UNDEFINED } from '../../i18n/ua'
import { asyncAction } from './index'

export const PRINT = action('PRINT')
export const SELECTED_ZONE = action('SELECTED_ZONE')
export const PRINT_SCALE = action('PRINT_SCALE')
export const PRINT_REQUISITES = action('PRINT_REQUISITES')
export const PRINT_REQUISITES_CLEAR = action('PRINT_REQUISITES_CLEAR')
export const PRINT_FILE_SET = action('PRINT_FILE_SET')
export const PRINT_FILE_REMOVE = action('PRINT_FILE_REMOVE')
export const FILES_TO_PRINT = action('FILES_TO_PRINT')

export const print = (mapId = null, name = '') => ({
  type: PRINT,
  mapId,
  name,
})

export const setPrintScale = (scale) => ({
  type: PRINT_SCALE,
  payload: scale,
})

export const setPrintRequisites = (data) => ({
  type: PRINT_REQUISITES,
  payload: data,
})

export const clearPrintRequisites = () => ({
  type: PRINT_REQUISITES_CLEAR,
})

export const setSelectedZone = (selectedZone) => ({
  type: SELECTED_ZONE,
  selectedZone,
})

export const printFileSet = (id, message, name) => ({
  type: PRINT_FILE_SET,
  payload: { id, message, name },
})

export const printFileRemove = (id) => ({
  type: PRINT_FILE_REMOVE,
  payload: id,
})

export const onFilesToPrint = () => ({
  type: FILES_TO_PRINT,
})

export const createPrintFile = () =>
  asyncAction.withNotification(async (dispatch, getState, { webmapApi: { printFileCreate } }) => {
    const state = getState()
    const {
      webMap: { objects },
      print: {
        requisites: {
          dpi,
          projectionGroup,
        },
        printScale,
        selectedZone,
        mapName,
      },
    } = state
    if (selectedZone) {
      const { southWest, northEast } = selectedZone
      const projection = getUSC2000Projection((southWest.lng + northEast.lng) / 2)
      const svg = getMapObjectsSvg(objects, southWest, northEast, projection, dpi, projectionGroup, printScale)
      const result = await printFileCreate({ southWest, northEast, dpi, svg, projectionGroup, printScale, mapName })
      const { id, name } = result
      dispatch(batchActions([
        printFileSet(id, 'sent', name),
        print(),
        clearPrintRequisites(),
      ]))
    } else {
      throw new Error(PRINT_ZONE_UNDEFINED)
    }
  })
