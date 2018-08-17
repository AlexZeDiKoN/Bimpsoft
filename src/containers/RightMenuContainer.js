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
    },
  } = store
  return {
    isSettingsShow,
    isSidebarShow,
  }
}
const mapDispatchToProps = (dispatch) => ({
  onClickSidebar: () => {
    dispatch(viewModesActions.viewModeToggle(viewModesKeys.sidebar))
    window.dispatchEvent(new Event('resize'))
  },
  onClickSettings: () => {
    dispatch(viewModesActions.viewModeToggle(viewModesKeys.settings))
  },
})
const LeftMenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RightMenu)

export default LeftMenuContainer
