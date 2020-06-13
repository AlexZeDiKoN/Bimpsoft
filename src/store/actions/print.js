import * as R from 'ramda'
import { batchActions } from 'redux-batched-actions'
import { action } from '../../utils/services'
import { getMapSvg } from '../../utils/svg/mapObjects'
import i18n from '../../i18n'
import { visibleLayersSelector } from '../selectors'
import { printLegendSvgStr } from '../../utils/svg'
import { LS } from '../../utils'
import { Print } from '../../constants'
import { LAT, LNG } from '../../services/coordinateGrid/constants'
import { setConfigPrintConstant } from '../../utils/svg/mapObject'
import { asyncAction } from './index'

export const PRINT = action('PRINT')
export const SELECTED_ZONE = action('SELECTED_ZONE')
export const PRINT_SCALE = action('PRINT_SCALE')
export const PRINT_REQUISITES = action('PRINT_REQUISITES')
export const PRINT_REQUISITES_CLEAR = action('PRINT_REQUISITES_CLEAR')
export const PRINT_FILE_SET = action('PRINT_FILE_SET')
export const PRINT_FILE_REMOVE = action('PRINT_FILE_REMOVE')
export const PRINT_FILE_LOG = action('PRINT_FILE_LOG')
export const PRINT_MAP_AVAILABILITY = action('PRINT_MAP_AVAILABILITY')

export const print = (mapId = null, name = '') =>
  (dispatch, getState) => {
    if (getState().print.mapId === null) {
      const { PRINT_PANEL_KEYS, COLOR_PICKER_KEYS } = Print
      const requisites = Object.keys(Object.assign(PRINT_PANEL_KEYS, COLOR_PICKER_KEYS))
        .reduce((prev, current) => {
          const value = LS.get(Print.LS_GROUP, PRINT_PANEL_KEYS[current])
          return value === null ? prev : { ...prev, [PRINT_PANEL_KEYS[current]]: value }
        }, {})
      dispatch(setPrintRequisites(requisites))
    }
    dispatch({
      type: PRINT,
      mapId,
      name,
    })
  }

export const setPrintScale = (scale) => ({
  type: PRINT_SCALE,
  payload: scale,
})

export const setPrintRequisites = (data) => {
  for (const [ key, value ] of Object.entries(data)) {
    LS.set(Print.LS_GROUP, key, value)
  }
  return ({
    type: PRINT_REQUISITES,
    payload: data,
  })
}

export const clearPrintRequisites = () =>
  (dispatch) => {
    LS.clear()
    dispatch({
      type: PRINT_REQUISITES_CLEAR,
    })
  }

export const setSelectedZone = (selectedZone) => ({
  type: SELECTED_ZONE,
  selectedZone,
})

export const printFileSet = (id, message, name, documentPath) => ({
  type: PRINT_FILE_SET,
  payload: { id, message, name, documentPath },
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

export const printFileRetry = (id, name) =>
  (dispatch, getState, { webmapApi: { printFileRetry } }) => {
    printFileRetry(id)
    dispatch(printFileSet(id, Print.PRINT_STEPS.SENT, name))
  }

export const createPrintFile = (onError = null) =>
  asyncAction.withNotification(async (dispatch, getState,
    { webmapApi: { getPrintBounds, printFileCreate, getDefaultConfig } }) => {
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
    const configPrint = await getDefaultConfig()
    const errorConfig = setConfigPrintConstant(configPrint)
    if (errorConfig !== '') {
      if (onError) { onError() }
      throw new Error(i18n.PRINT_CONFIG_ERROR + errorConfig)
    }
    const layersById = R.filter((layer) => layer.mapId === mapId, visibleLayersSelector(state))

    if (selectedZone) {
      const { dpi, projectionGroup } = requisites
      const { southWest, northEast } = selectedZone

      const printBounds = await getPrintBounds({
        extent: [ southWest.lng, southWest.lat, northEast.lng, northEast.lat ],
        scale: printScale,
        projectionGroup,
      })

      const { parts, size: [ width, height ] } = printBounds
      const partsSvgs = parts.map((part) =>
        getMapSvg(part, { objects, dpi, printScale, layersById, showAmplifiers }))

      const legendSvg = printLegendSvgStr({
        widthMM: width,
        heightMM: height,
        dpi,
        requisites,
        printScale,
        selectedZone,
        strokeScale: 1, // необходимо для создания обводки текста в Qgis
      })

      const result = await printFileCreate({
        scale: printScale, printBounds, dpi, partsSvgs, legendSvg, mapName, mapId, requisites,
      })
      const { id } = result
      dispatch(batchActions([
        printFileSet(id, Print.PRINT_STEPS.SENT, mapName),
        print(),
        clearPrintRequisites(),
      ]))
    } else {
      if (onError) { onError() }
      throw new Error(i18n.PRINT_ZONE_UNDEFINED)
    }
  })

// запит наявності номенклатурних листів
export const getMapAvailability = (printScale, coordinates) =>
  async (dispatch, getState, { webmapApi: { printFileMapAvailability } }) => {
    const coordinatesRequest = coordinates.map((coordinate) => {
      return { lat: coordinate[LAT], lng: coordinate[LNG] }
    })
    // запит на сервер
    const response = await printFileMapAvailability(printScale, coordinatesRequest)
    const gridIdRequest = coordinates.map((coord) => `${printScale}_${coord[LAT].toFixed(6)}_${coord[LNG].toFixed(6)}`)
    const gridIdUnavailable = response.unavailable.map((coord) => `${printScale}_${coord.lat.toFixed(6)}_${coord.lng.toFixed(6)}`)
    dispatch({
      type: PRINT_MAP_AVAILABILITY,
      payload: { gridIdRequest, gridIdUnavailable },
    })
  }
