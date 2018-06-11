export const VIEW_MODE_TOGGLE = 'VIEW_MODE_TOGGLE'
export const VIEW_MODE_DISABLE = 'VIEW_MODE_DISABLE'

export const viewModeToggle = (name) => ({
  type: VIEW_MODE_TOGGLE,
  payload: name,
})
export const viewModeDisable = (name) => ({
  type: VIEW_MODE_DISABLE,
  payload: name,
})
