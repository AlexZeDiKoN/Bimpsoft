import { action } from '../../utils/services'
import { getUSC2000Projection } from '../../utils/projection'
import { getMapObjectsSvg } from '../../utils/svg/mapObjects'
import { PRINT_ZONE_UNDEFINED, ERROR } from '../../i18n/ua'
import * as notifications from './notifications'
import { asyncAction } from './index'

export const PRINT = action('PRINT')
export const SELECTED_ZONE = action('SELECTED_ZONE')
export const PRINT_SCALE = action('PRINT_SCALE')
export const PRINT_REQUISITES = action('PRINT_REQUISITES')
export const PRINT_REQUISITES_CLEAR = action('PRINT_REQUISITES_CLEAR')
export const PRINT_FILE_SET = action('PRINT_FILE_SET')
export const PRINT_FILE_REMOVE = action('PRINT_FILE_REMOVE')

export const print = (mapId = null) => ({
  type: PRINT,
  mapId,
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

export const printFileSet = (printFile) => ({
  type: PRINT_FILE_SET,
  payload: printFile,
})

export const printFileRemove = (id) => ({
  type: PRINT_FILE_REMOVE,
  payload: id,
})

export const createPrintFile = () =>
  asyncAction.withNotification(async (dispatch, getState, { webmapApi: { printFileCreate } }) => {
    try {
      const state = getState()
      const {
        webMap: { objects },
        print: {
          requisites: {
            dpi,
            coordinatesType,
          },
          printScale,
          selectedZone: { southWest, northEast },
        },
      } = state
      const projection = getUSC2000Projection((southWest.lng + northEast.lng) / 2)
      const svg = getMapObjectsSvg(objects, southWest, northEast, projection, dpi, coordinatesType, printScale)
      const result = await printFileCreate({ southWest, northEast, projection, dpi, svg, coordinatesType, printScale })
      const { id } = result
      dispatch(printFileSet({ id }))
    } catch (e) {
      dispatch(notifications.push({
        message: ERROR,
        description: PRINT_ZONE_UNDEFINED,
        type: 'error',
      }))
      return
    }
    dispatch(print())
    dispatch(clearPrintRequisites())
  })
