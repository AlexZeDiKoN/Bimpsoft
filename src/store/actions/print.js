import { batchActions } from 'redux-batched-actions'
import { action } from '../../utils/services'
import { getMapSvg } from '../../utils/svg/mapObjects'
import { PRINT_ZONE_UNDEFINED } from '../../i18n/ua'
import { visibleLayersSelector } from '../selectors'
import { printLegendSvgStr } from '../../utils/svg'
import { asyncAction } from './index'

export const PRINT = action('PRINT')
export const SELECTED_ZONE = action('SELECTED_ZONE')
export const PRINT_SCALE = action('PRINT_SCALE')
export const PRINT_REQUISITES = action('PRINT_REQUISITES')
export const PRINT_REQUISITES_CLEAR = action('PRINT_REQUISITES_CLEAR')
export const PRINT_FILE_SET = action('PRINT_FILE_SET')
export const PRINT_FILE_REMOVE = action('PRINT_FILE_REMOVE')
export const PRINT_FILE_LOG = action('PRINT_FILE_LOG')

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

export const printFileList = () =>
  async (dispatch, getState, { webmapApi: { printFileList } }) => {
    const filesList = await printFileList()
    dispatch({
      type: PRINT_FILE_LOG,
      filesList,
    })
  }

export const printFileCancel = (id) =>
  (dispatch, getState, { webmapApi: { printFileCancel } }) => {
    printFileCancel(id)
    dispatch({
      type: PRINT_FILE_REMOVE,
      payload: id,
    })
  }

// TODO: заменить реальными данными
const signatories = [
  { position: `Начальник штабу`, role: `полковник`, name: `О.С. Харченко`, date: `21.12.18` },
  { position: `Начальник оперативного управління`, role: `полковник`, name: `І.І. Панас`, date: `22.12.18` },
]
const confirmDate = `22.12.18`

export const createPrintFile = () =>
  asyncAction.withNotification(async (dispatch, getState, { webmapApi: { getPrintBounds, printFileCreate } }) => {
    const state = getState()
    const {
      webMap: { objects, showAmplifiers },
      print: {
        requisites,
        printScale,
        selectedZone,
        mapName,
        mapId,
      },
    } = state
    const layersById = visibleLayersSelector(state)
    if (selectedZone) {
      const { dpi, projectionGroup } = requisites
      const { southWest, northEast } = selectedZone

      const printBounds = await getPrintBounds({
        extent: [ southWest.lng, southWest.lat, northEast.lng, northEast.lat ],
        scale: printScale,
        projectionGroup,
      })

      // const printBounds = {
      //   parts: [
      //     {
      //       srid: 5563,
      //       extent: [ southWest.lng, southWest.lat, northEast.lng, northEast.lat ],
      //       angle: 2,
      //     },
      //   ],
      //   size: [ 500, 500 ],
      // }

      const { parts, size: [ width, height ] } = printBounds
      const partsSvgs = parts.map((part) => getMapSvg(part, { objects, dpi, printScale, layersById, showAmplifiers }))

      const legendSvg = printLegendSvgStr({
        widthMM: width,
        heightMM: height,
        dpi,
        requisites,
        signatories,
        confirmDate,
        printScale,
      })

      const result = await printFileCreate({ printBounds, dpi, partsSvgs, legendSvg, mapName, mapId })
      const { id } = result
      dispatch(batchActions([
        printFileSet(id, 'sent', mapName),
        print(),
        clearPrintRequisites(),
      ]))
    } else {
      throw new Error(PRINT_ZONE_UNDEFINED)
    }
  })
