import { connect } from 'react-redux'
import { batchActions } from 'redux-batched-actions/lib/index'
import LeftMenu from '../components/menu/LeftMenu'
import * as viewModesKeys from '../constants/viewModesKeys'
import { viewModes, layers, webMap, targeting } from '../store/actions'
import { canEditSelector, layerNameSelector } from '../store/selectors'
import { catchErrors } from '../store/actions/asyncAction'

const mapStateToProps = (store) => {
  const {
    viewModes: {
      [viewModesKeys.subordinationLevel]: isShowSubordinationLevel,
    },
    targeting: { targetingMode },
    webMap: {
      subordinationLevel,
      subordinationAuto,
      isMeasureOn,
      isMarkersOn: marker,
      isTopographicObjectsOn: topographicObjects,
    },
    print: { printFiles },
  } = store

  const layerName = layerNameSelector(store)
  const isEditMode = canEditSelector(store)
  return {
    isEditMode,
    isShowSubordinationLevel,
    isMeasureOn,
    subordinationLevel,
    subordinationAuto,
    marker,
    topographicObjects,
    layerName,
    targetingMode,
    printFilesCount: printFiles
      ? Object.keys(printFiles).length
      : null,
  }
}
const mapDispatchToProps = {
  onChangeEditMode: layers.setEditMode,
  onClickSubordinationLevel: () => viewModes.viewModeToggle(viewModesKeys.subordinationLevel),
  onMeasureChange: webMap.toggleMeasure,
  onMarkerChange: webMap.toggleMarkers,
  onTopographicObjectsChange: webMap.toggleTopographicObjects,
  onSubordinationLevelClose: () => viewModes.viewModeDisable(viewModesKeys.subordinationLevel),
  onSetSubordinationLevelAuto: () => batchActions([
    webMap.setSubordinationLevelAuto(true),
    webMap.setSubordinationLevelByZoom(),
    viewModes.viewModeDisable(viewModesKeys.subordinationLevel),
  ]),
  onSubordinationLevelChange: (subordinationLevel) => batchActions([
    webMap.setSubordinationLevelAuto(false),
    webMap.setSubordinationLevel(subordinationLevel),
    viewModes.viewModeDisable(viewModesKeys.subordinationLevel),
  ]),
  onToggleTargetingMode: targeting.toggleTargetingMode,
}
const LeftMenuContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps)
)(LeftMenu)

export default LeftMenuContainer
