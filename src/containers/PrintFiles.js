import { connect } from 'react-redux'
import PrintFiles from '../components/menu/PrintFiles'
import * as viewModesKeys from '../constants/viewModesKeys'
import { print, viewModes, webMap } from '../store/actions'

const mapStateToProps = (store) => {
  const {
    print: {
      printFiles,
    },
  } = store
  return {
    printFiles,
  }
}

const mapDispatchToProps = (dispatch) => ({
  onClickSettings: () => dispatch(viewModes.viewModeToggle(viewModesKeys.settings)),
  onSearch: (sample) => dispatch(viewModes.search(sample)),
  onCoordinates: (text, point) => dispatch(webMap.setMarker({ text, point })),
  onSelectSearchOption: (index) => dispatch(viewModes.searchSelectOption(index)),
  onClearSearchError: () => dispatch(viewModes.searchClearError()),
  onFilesToPrint: () => dispatch(print.onFilesToPrint()),
})

const PrintFilesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PrintFiles)

export default PrintFilesContainer
