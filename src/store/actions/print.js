import { action } from '../../utils/services'

export const PRINT = action('PRINT')
export const PRINT_SCALE = action('PRINT_SCALE')

export const print = () => ({
  type: PRINT,
})

export const printScale = (scale) => ({
  type: PRINT_SCALE,
  payload: scale,
})
