import { connect } from 'react-redux'
import * as viewModesKeys from '../constants/viewModesKeys'
import MapsSourcesComponent from '../components/MapsSourcesComponent'
import * as webMapActions from '../store/actions/webMap'
import * as viewModesActions from '../store/actions/viewModes'
import { MapSources } from '../constants'

const mapStateToProps = (store) => ({
  visible: store.viewModes[viewModesKeys.mapSourcesList],
  source: store.webMap.source,
  sources: MapSources,
})

const mapDispatchToProps = {
  onSelect: (source) => (dispatch) => {
    dispatch(webMapActions.setSource(source))
    dispatch(viewModesActions.viewModeDisable(viewModesKeys.mapSourcesList))
  },
  onClose: (source) => viewModesActions.viewModeDisable(viewModesKeys.mapSourcesList),
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapsSourcesComponent)
