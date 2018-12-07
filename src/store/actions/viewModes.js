import { action } from '../../utils/services'
import * as asyncAction from './asyncAction'

export const VIEW_MODE_TOGGLE = action('VIEW_MODE_TOGGLE')
export const VIEW_MODE_DISABLE = action('VIEW_MODE_DISABLE')
export const VIEW_MODE_ENABLE = action('VIEW_MODE_ENABLE')
export const SEARCH_PLACE = action('SEARCH_PLACE')
export const SEARCH_SELECT_OPTION = action('SEARCH_SELECT_OPTION')
export const SEARCH_CLEAR_ERROR = action('SEARCH_CLEAR_ERROR')
export const SEARCH_COORDINATES = action('SEARCH_COORDINATES')

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

export const search = (sample) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { placeSearch } }) => {
    const payload = await placeSearch(sample)
    dispatch({
      type: SEARCH_PLACE,
      payload,
    })
  })

export const searchSelectOption = (index) => ({
  type: SEARCH_SELECT_OPTION,
  payload: index,
})

export const searchClearError = () => ({
  type: SEARCH_CLEAR_ERROR,
})

export const coordinates = (payload) => ({
  type: SEARCH_COORDINATES,
  payload,
})
