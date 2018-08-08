export const actionNames = {
  TOGGLE_MAP_EDIT_MODE: Symbol('TOGGLE_MAP_EDIT_MODE'),
  TOGGLE_POINT_MARK_EDIT_MODE: Symbol('TOGGLE_POINT_MARK_EDIT_MODE'),
  TOGGLE_TEXT_MARK_EDIT_MODE: Symbol('TOGGLE_TEXT_MARK_EDIT_MODE'),
  TOGGLE_TIMELINE_EDIT_MODE: Symbol('TOGGLE_TIMELINE_EDIT_MODE'),
  SET_COORDINATES_TYPE: Symbol('SET_COORDINATES_TYPE'),
  SET_MINIMAP: Symbol('SET_MINIMAP'),
  SET_AMPLIFIERS: Symbol('SET_AMPLIFIERS'),
  SET_GENERALIZATION: Symbol('SET_GENERALIZATION'),
  SET_SOURCE: Symbol('SET_SOURCE'),
  SUBORDINATION_LEVEL: Symbol('SUBORDINATION_LEVEL'),
}

export const toggleMapEditMode = (value) => ({
  type: actionNames.TOGGLE_MAP_EDIT_MODE,
  payload: value,
})

export const togglePointMarkEditMode = (value) => ({
  type: actionNames.TOGGLE_POINT_MARK_EDIT_MODE,
  payload: value,
})

export const toggleTextMarkEditMode = (value) => ({
  type: actionNames.TOGGLE_TEXT_MARK_EDIT_MODE,
  payload: value,
})

export const setCoordinatesType = (value) => ({
  type: actionNames.SET_COORDINATES_TYPE,
  payload: value,
})
export const setMiniMap = (value) => ({
  type: actionNames.SET_MINIMAP,
  payload: value,
})
export const setAmplifiers = (value) => ({
  type: actionNames.SET_AMPLIFIERS,
  payload: value,
})
export const setGeneralization = (value) => ({
  type: actionNames.SET_GENERALIZATION,
  payload: value,
})
export const setSource = (value) => ({
  type: actionNames.SET_SOURCE,
  payload: value,
})
export const setSubordinationLevel = (value) => ({
  type: actionNames.SUBORDINATION_LEVEL,
  payload: value,
})
