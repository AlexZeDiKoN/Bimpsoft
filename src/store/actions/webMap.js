export const actionNames = {
  TOGGLE_MAP_EDIT_MODE: Symbol('TOGGLE_MAP_EDIT_MODE'),
  TOGGLE_POINT_MARK_EDIT_MODE: Symbol('TOGGLE_POINT_MARK_EDIT_MODE'),
}

export const toggleMapEditMode = () => ({ type: actionNames.TOGGLE_MAP_EDIT_MODE })

export const togglePointMarkEditMode = () => ({ type: actionNames.TOGGLE_POINT_MARK_EDIT_MODE })
