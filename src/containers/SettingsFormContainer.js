import { connect } from 'react-redux'
import * as viewModesKeys from '../constants/viewModesKeys'
import SettingsForm from '../components/SettingsForm'
import * as viewModesActions from '../store/actions/viewModes'
import * as webMapActions from '../store/actions/webMap'
import * as paramsActions from '../store/actions/params'

const mapStateToProps = (store) => ({
  visible: store.viewModes[viewModesKeys.settings],
  coordinatesType: store.webMap.coordinatesType,
  showMiniMap: store.webMap.showMiniMap,
  params: store.params,
  showAmplifiers: store.webMap.showAmplifiers,
  // generalization: store.webMap.generalization,
})
const mapDispatchToProps = (dispatch) => ({
  onClose: () => {
    dispatch(viewModesActions.viewModeDisable(viewModesKeys.settings))
  },
  onChangeCoordinatesType: (coordinatesType) => {
    dispatch(webMapActions.setCoordinatesType(coordinatesType))
  },
  onChangeShowMiniMap: (showMiniMap) => {
    dispatch(webMapActions.setMiniMap(showMiniMap))
  },
  onChangeShowAmplifier: (showAmplifiers) => {
    dispatch(webMapActions.setAmplifiers(showAmplifiers))
  },
  /* onChangeGeneralization: (generalization) => {
    dispatch(webMapActions.setGeneralization(generalization))
  }, */
  onChangeParam: (type, value) => {
    dispatch(paramsActions.saveParam(type, value))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsForm)
