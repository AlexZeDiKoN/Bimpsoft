/* global Event */
import { connect } from 'react-redux'
import RightMenu from '../components/menu/RightMenu'
import * as viewModesKeys from '../constants/viewModesKeys'
import { viewModes, webMap } from '../store/actions'
import { SET_SEARCH_OPTIONS } from '../store/actions/viewModes'

const mapStateToProps = (store) => {
  const {
    viewModes: {
      [viewModesKeys.sidebar]: isSidebarShow,
      [viewModesKeys.settings]: isSettingsShow,
      searchEmpty: searchFailed,
    },
    print: {
      printFiles,
    },
  } = store
  return {
    isSettingsShow,
    isSidebarShow,
    searchFailed,
    printFiles,
  }
}

const mapDispatchToProps = (dispatch) => ({
  onClickSidebar: () => {
    const result = dispatch(viewModes.viewModeToggle(viewModesKeys.sidebar))
    window.dispatchEvent(new Event('resize'))
    return result
  },
  onClickSettings: () => dispatch(viewModes.viewModeToggle(viewModesKeys.settings)),
  onSearch: (sample) => dispatch(viewModes.search(sample)),
  onCoordinates: (text, point) => dispatch(webMap.setMarker({ text, point })),
  onSelectSearchOption: (index) => dispatch(viewModes.searchSelectOption(index)),
  onClearSearchError: () => dispatch(viewModes.searchClearError),
  onCloseSearch: () => dispatch(viewModes.searchCloseList),
  onManyCoords: (list) => dispatch({
    type: SET_SEARCH_OPTIONS,
    payload: list,
  }),
})

const RightMenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RightMenu)

export default RightMenuContainer
