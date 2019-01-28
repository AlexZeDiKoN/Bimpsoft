import { action } from '../../utils/services'
import { getUSC2000Projection } from '../../utils/projection'
import { getMapObjectsSvg } from '../../utils/svg/mapObjects'
import { asyncAction } from './index'

export const PRINT_FILE_SET = action('PRINT_FILE_SET')
export const PRINT_FILE_REMOVE = action('PRINT_FILE_REMOVE')

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
    const svg = getMapObjectsSvg(objects, southWest, northEast, projection, dpi, printScale)
    console.log(svg)
    const result = await printFileCreate({ southWest, northEast, projection, dpi, svg, coordinatesType })
    const { id } = result
    dispatch(printFileSet({ id }))
  })
