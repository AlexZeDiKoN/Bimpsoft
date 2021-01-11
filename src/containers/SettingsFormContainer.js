import { connect } from 'react-redux'
import * as viewModesKeys from '../constants/viewModesKeys'
import SettingsForm from '../components/SettingsForm'
import * as viewModesActions from '../store/actions/viewModes'
import * as webMapActions from '../store/actions/webMap'
import * as paramsActions from '../store/actions/params'
import * as paramNames from '../constants/params'

const mapStateToProps = (store) => ({
  visible: store.viewModes[viewModesKeys.settings],
  coordinatesType: store.webMap.coordinatesType,
  showMiniMap: store.webMap.showMiniMap,
  params: store.params,
  showAmplifiers: store.webMap.showAmplifiers,
  shownAmplifiers: store.webMap.shownAmplifiers,
  generalization: store.webMap.generalization,
})
const mapDispatchToProps = (dispatch) => ({
  onClose: () => {
    dispatch(viewModesActions.viewModeDisable(viewModesKeys.settings))
  },
  onChangeCoordinatesType: (coordinatesType) => {
    dispatch(webMapActions.setCoordinatesType(coordinatesType))
    dispatch(paramsActions.saveParam(paramNames.DEFAULT_COORD_SYSTEM, coordinatesType))
  },
  onChangeShowMiniMap: ({ target: { checked: showMiniMap } }) => {
    dispatch(webMapActions.setMiniMap(showMiniMap))
    dispatch(paramsActions.saveParam(paramNames.MINI_MAP, showMiniMap))
  },
  onChangeShowAmplifier: ({ target: { checked: showAmplifiers } }) => {
    dispatch(webMapActions.setAmplifiers(showAmplifiers))
    dispatch(paramsActions.saveParam(paramNames.SHOW_AMPLIFIERS, showAmplifiers))
  },
  onChangeShownAmplifiers: (shownAmplifiers) => {
    dispatch(webMapActions.setAmplifiersFilter(shownAmplifiers))
  },
  onChangeGeneralization: ({ target: { checked: generalization } }) => {
    dispatch(webMapActions.setGeneralization(generalization))
    dispatch(paramsActions.saveParam(paramNames.GENERALIZATION, generalization))
  },
  onChangeParam: (type, value) => {
    dispatch(paramsActions.saveParam(type, value))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsForm)
