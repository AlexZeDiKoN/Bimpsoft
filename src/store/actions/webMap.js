export const actionNames = {
  TOGGLE_MAP_EDIT_MODE: Symbol('TOGGLE_MAP_EDIT_MODE'),
  TOGGLE_POINT_MARK_EDIT_MODE: Symbol('TOGGLE_POINT_MARK_EDIT_MODE'),
  TOGGLE_TEXT_MARK_EDIT_MODE: Symbol('TOGGLE_TEXT_MARK_EDIT_MODE'),
  TOGGLE_TIMELINE_EDIT_MODE: Symbol('TOGGLE_TIMELINE_EDIT_MODE'),
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

export const toggleTimelineEditMode = (value) => ({
  type: actionNames.TOGGLE_TIMELINE_EDIT_MODE,
  payload: value,
})
