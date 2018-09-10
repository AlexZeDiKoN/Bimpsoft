/* global Event */
import { connect } from 'react-redux'
import RightMenu from '../components/menu/RightMenu'
import * as viewModesKeys from '../constants/viewModesKeys'
import * as viewModesActions from '../store/actions/viewModes'

const mapStateToProps = (store) => {
  const {
    viewModes: {
      [viewModesKeys.sidebar]: isSidebarShow,
      [viewModesKeys.settings]: isSettingsShow,
      [viewModesKeys.searchEmpty]: searchFailed,
    },
  } = store
  return {
    isSettingsShow,
    isSidebarShow,
    searchFailed,
  }
}

const mapDispatchToProps = (dispatch) => ({
  onClickSidebar: () => {
    const result = dispatch(viewModesActions.viewModeToggle(viewModesKeys.sidebar))
    window.dispatchEvent(new Event('resize'))
    return result
  },
  onClickSettings: () => dispatch(viewModesActions.viewModeToggle(viewModesKeys.settings)),
  onSearch: (sample) => dispatch(viewModesActions.search(sample)),
  onCoordinates: (text, point) => dispatch(viewModesActions.coordinates({ text, point })),
  onSelectSearchOption: (index) => dispatch(viewModesActions.searchSelectOption(index)),
  onClearSearchError: () => dispatch(viewModesActions.searchClearError()),
})

const RightMenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RightMenu)

export default RightMenuContainer
