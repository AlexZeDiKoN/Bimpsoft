import { action } from '../../utils/services'
import { asyncAction, webMap } from '.'

export const VIEW_MODE_TOGGLE = action('VIEW_MODE_TOGGLE')
export const VIEW_MODE_DISABLE = action('VIEW_MODE_DISABLE')
export const VIEW_MODE_ENABLE = action('VIEW_MODE_ENABLE')
export const VIEW_MODE_SET_SIDEBAR_TAB_INDEX = action('VIEW_MODE_SET_SIDEBAR_TAB_INDEX')
export const SET_SEARCH_OPTIONS = action('SET_SEARCH_OPTIONS')
export const SET_SEARCH_EMPTY = action('SET_SEARCH_EMPTY')

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

export const viewModeSetSidebarTabIndex = (payload) => ({
  type: VIEW_MODE_SET_SIDEBAR_TAB_INDEX,
  payload,
})

export const search = (sample) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { placeSearch } }) => {
    let searchOptions = await placeSearch(sample)
    searchOptions = searchOptions.map((item) => ({ ...item, sample }))

    switch (searchOptions.length) {
      case 0:
        dispatch({
          type: SET_SEARCH_EMPTY,
          payload: true,
        })
        break
      case 1:
        dispatch({
          type: SET_SEARCH_OPTIONS,
          payload: null,
        })
        dispatch(webMap.setMarker(searchOptions[0]))
        break
      default:
        dispatch({
          type: SET_SEARCH_OPTIONS,
          payload: searchOptions,
        })
    }
  })

export const searchSelectOption = (index) => (dispatch, getState) => {
  const state = getState()
  const option = state.viewModes.searchOptions[index]
  if (option) {
    dispatch({
      type: SET_SEARCH_OPTIONS,
      payload: null,
    })
    dispatch(webMap.setMarker(option))
  }
}

export const searchClearError = ({
  type: SET_SEARCH_EMPTY,
  payload: false,
})

export const searchCloseList = ({
  type: SET_SEARCH_OPTIONS,
  payload: null,
})
