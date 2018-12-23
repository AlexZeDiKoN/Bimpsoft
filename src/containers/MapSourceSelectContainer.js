import { connect } from 'react-redux'
import MapSourceSelect from '../components/MapSourceSelect'
import * as webMapActions from '../store/actions/webMap'
import * as viewModesActions from '../store/actions/viewModes'
import { viewModesKeys } from '../constants'

const mapStateToProps = (store) => ({
  isShowSources: store.viewModes[viewModesKeys.mapSourcesList],
  source: store.webMap.source,
  sources: store.webMap.sources,
})

const mapDispatchToProps = {
  onClickMapSource: () => viewModesActions.viewModeToggle(viewModesKeys.mapSourcesList),
  onSelect: (source) => (dispatch) => {
    dispatch(webMapActions.setSource(source))
    dispatch(viewModesActions.viewModeDisable(viewModesKeys.mapSourcesList))
  },
  onClose: (source) => viewModesActions.viewModeDisable(viewModesKeys.mapSourcesList),
}

const MapSourceSelectContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MapSourceSelect)

export default MapSourceSelectContainer
