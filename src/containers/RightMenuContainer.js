import { connect } from 'react-redux'
import RightMenu from '../components/menu/RightMenu'
import * as viewModesKeys from '../constants/viewModesKeys'
import { viewModes } from '../store/actions'

const mapStateToProps = (store) => {
  const {
    viewModes: {
      [viewModesKeys.settings]: isSettingsShow,
      [viewModesKeys.map3D]: is3DMapMode,
    },
    print: {
      printFiles,
    },
  } = store
  return {
    isSettingsShow,
    is3DMapMode,
    printFiles,
  }
}

const mapDispatchToProps = (dispatch) => ({
  onClickSettings: () => dispatch(viewModes.viewModeToggle(viewModesKeys.settings)),
  onSelectSearchOption: (index) => dispatch(viewModes.searchSelectOption(index)),
})

const RightMenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RightMenu)

export default RightMenuContainer
