import { batchActions } from 'redux-batched-actions'
import ReactDOMServer from 'react-dom/server'
import { action } from '../../utils/services'
import { getUSC2000Projection } from '../../utils/projection'
import { getMapObjectsSvg } from '../../utils/svg/mapObjects'
import { PRINT_ZONE_UNDEFINED } from '../../i18n/ua'
import { visibleLayersSelector } from '../selectors'
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

// TODO: заменить реальными данными
const signatories = [
  { position: `Начальник штабу`, role: `полковник`, name: `О.С. Харченко`, date: `21.12.18` },
  { position: `Начальник оперативного управління`, role: `полковник`, name: `І.І. Панас`, date: `22.12.18` },
]
const confirmDate = `22.12.18`

export const createPrintFile = () =>
  asyncAction.withNotification(async (dispatch, getState, { webmapApi: { printFileCreate } }) => {
    const state = getState()
    const {
      webMap: { objects },
      print: {
        requisites,
        printScale,
        selectedZone,
      },
    } = state
    const layersById = visibleLayersSelector(state)
    if (selectedZone) {
      const { southWest, northEast } = selectedZone
      const projection = getUSC2000Projection((southWest.lng + northEast.lng) / 2)
      const svg = ReactDOMServer.renderToStaticMarkup(getMapObjectsSvg({
        objects,
        southWest,
        northEast,
        projection,
        requisites,
        printScale,
        signatories,
        confirmDate,
        layersById,
      }))
      const { dpi, projectionGroup } = requisites
      const result = await printFileCreate({ southWest, northEast, projection, dpi, svg, projectionGroup, printScale })
      const { id } = result
      dispatch(batchActions([
        printFileSet({ id }),
        print(),
        clearPrintRequisites(),
      ]))
    } else {
      throw new Error(PRINT_ZONE_UNDEFINED)
    }
  })
