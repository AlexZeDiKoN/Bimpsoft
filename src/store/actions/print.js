import { action } from '../../utils/services'

export const PRINT = action('PRINT')
export const SELECTED_ZONE = action('SELECTED_ZONE')
export const PRINT_SCALE = action('PRINT_SCALE')
export const PRINT_REQUISITES = action('PRINT_REQUISITES')
export const PRINT_REQUISITES_CLEAR = action('PRINT_REQUISITES_CLEAR')

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
