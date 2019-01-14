import { generateTextSymbolSvg } from '../../utils/svg'
import { action } from '../../utils/services'
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
    const { webMap: { center } } = state
    const dpi = 600
    const northEast = { lat: center.lat, lng: center.lng }
    const southWest = { lat: center.lat, lng: center.lng }
    const svg = generateTextSymbolSvg({
      texts: [ { text: 'Hello world!!!' }, { text: 'Тестовий svg файл' } ],
    })
    const result = await printFileCreate({ dpi, northEast, southWest, svg })
    const { id } = result
    dispatch(printFileSet({ id }))
  })
