import { connect } from 'react-redux'
import * as viewModesKeys from '../constants/viewModesKeys'
import SettingsForm from '../components/SettingsForm'
import * as viewModesActions from '../store/actions/viewModes'
import * as webMapActions from '../store/actions/webMap'
import * as paramsActions from '../store/actions/params'
import { pointSizesSelector } from '../store/selectors/params'
import { POINT_SIZE_MAX, POINT_SIZE_MIN } from '../constants/params'

const mapStateToProps = (store) => ({
  visible: store.viewModes[viewModesKeys.settings],
  coordinatesType: store.webMap.coordinatesType,
  showMiniMap: store.webMap.showMiniMap,
  pointSizes: pointSizesSelector(store),
  showAmplifiers: store.webMap.showAmplifiers,
  generalization: store.webMap.generalization,
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
  onChangeGeneralization: (generalization) => {
    dispatch(webMapActions.setGeneralization(generalization))
  },
  onChangePointSizes: (min, max) => {
    dispatch(paramsActions.saveParam(POINT_SIZE_MIN, min))
    dispatch(paramsActions.saveParam(POINT_SIZE_MAX, max))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsForm)
