import { action } from '../../utils/services'

export const DROP_FLEX_GRID = action('DROP_FLEX_GRID')
export const SHOW_FLEX_GRID_FORM = action('SHOW_FLEX_GRID_FORM')
export const HIDE_FLEX_GRID = action('HIDE_FLEX_GRID')
export const SET_FLEX_GRID_OPTIONS = action('SET_FLEX_GRID_OPTIONS')

export const setFlexGridOptions = (options) => ({
  type: SET_FLEX_GRID_OPTIONS,
  payload: options,
})

export const dropFlexGrid = () => ({
  type: DROP_FLEX_GRID,
})

export const showFlexGridOptions = () => ({
  type: SHOW_FLEX_GRID_FORM,
})

export const hideFlexGrid = () => ({
  type: HIDE_FLEX_GRID,
})
