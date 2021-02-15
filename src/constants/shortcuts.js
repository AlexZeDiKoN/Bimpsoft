import KeyCode from 'keycode-js'
// info: https://www.w3.org/TR/uievents-key/#named-key-attribute-values

export const ADD_POINT = (e) => e.altKey && e.keyCode === KeyCode.KEY_1
export const ADD_SEGMENT = (e) => e.altKey && e.keyCode === KeyCode.KEY_2
export const ADD_AREA = (e) => e.altKey && e.keyCode === KeyCode.KEY_3
export const ADD_CURVE = (e) => e.altKey && e.keyCode === KeyCode.KEY_4
export const ADD_POLYGON = (e) => e.altKey && e.keyCode === KeyCode.KEY_5
export const ADD_POLYLINE = (e) => e.altKey && e.keyCode === KeyCode.KEY_6
export const ADD_CIRCLE = (e) => e.altKey && e.keyCode === KeyCode.KEY_7
export const ADD_RECTANGLE = (e) => e.altKey && e.keyCode === KeyCode.KEY_8
export const ADD_SQUARE = (e) => e.altKey && e.keyCode === KeyCode.KEY_9
export const ADD_TEXT = (e) => e.altKey && e.keyCode === KeyCode.KEY_0
export const DROP_FLEX_GRID = (e) => e.altKey && e.keyCode === KeyCode.KEY_R

export const DELETE = (e) => e.key === 'Delete'
export const ENTER = (e) => e.key === 'Enter'
export const COPY = (e) => e.key === 'Copy' || (e.ctrlKey && e.keyCode === KeyCode.KEY_C)
export const PASTE = (e) => e.key === 'Paste' || (e.ctrlKey && e.keyCode === KeyCode.KEY_V)
export const CUT = (e) => e.key === 'Cut' || (e.ctrlKey && e.keyCode === KeyCode.KEY_X)
export const ESC = (e) => e.key === 'Escape'
export const SPACE = (e) => e.key === ' '
export const UNDO = (e) => e.key === 'Undo' || (e.ctrlKey && !e.shiftKey && e.keyCode === KeyCode.KEY_Z)
export const REDO = (e) => e.key === 'Redo' || (e.ctrlKey && e.shiftKey && e.keyCode === KeyCode.KEY_Z)
export const ANY_KEY = () => true
export const EDIT_KEY = (e) => e.key === 'Delete' ||
  e.key === 'Enter' ||
  e.key === 'Copy' || (e.ctrlKey && e.keyCode === KeyCode.KEY_C) ||
  e.key === 'Paste' || (e.ctrlKey && e.keyCode === KeyCode.KEY_V) ||
  e.key === 'Cut' || (e.ctrlKey && e.keyCode === KeyCode.KEY_X) ||
  e.key === 'Escape' ||
  e.key === ' '
