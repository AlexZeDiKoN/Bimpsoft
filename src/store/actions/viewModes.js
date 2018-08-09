import { action } from '../../utils/services'

export const VIEW_MODE_TOGGLE = action('VIEW_MODE_TOGGLE')
export const VIEW_MODE_DISABLE = action('VIEW_MODE_DISABLE')
export const VIEW_MODE_ENABLE = action('VIEW_MODE_ENABLE')

export const viewModeToggle = (name) => ({
  type: VIEW_MODE_TOGGLE,
  payload: name,
})

export const viewModeDisable = (name) => ({
  type: VIEW_MODE_DISABLE,
  payload: name,
})

export const viewModeEnable = (name) => ({
  type: VIEW_MODE_ENABLE,
  payload: name,
})
