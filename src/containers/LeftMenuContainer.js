import { connect } from 'react-redux'
import { batchActions } from 'redux-batched-actions/lib/index'
import LeftMenu from '../components/menu/LeftMenu'
import * as viewModesKeys from '../constants/viewModesKeys'
import { viewModes, layers, webMap } from '../store/actions'
import { canEditSelector, layerNameSelector, mapCOP, targetingModeSelector, taskModeSelector } from '../store/selectors'
import { catchErrors } from '../store/actions/asyncAction'
import { MapModes } from '../constants'

const mapStateToProps = (store) => {
  const {
    viewModes: {
      [viewModesKeys.subordinationLevel]: isShowSubordinationLevel,
    },
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
  const targetingMode = targetingModeSelector(store)
  const isTaskMode = taskModeSelector(store)
  const isMapCOP = mapCOP(store)

  return {
    isMapCOP,
    isEditMode,
    isTaskMode,
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
  onChangeTargetingMode: (targetingMode) => webMap.setMapMode(targetingMode ? MapModes.TARGET : MapModes.NONE),
  onChangeTaskMode: (taskMode) => webMap.setMapMode(taskMode ? MapModes.TASK : MapModes.NONE),
}
const LeftMenuContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps)
)(LeftMenu)

export default LeftMenuContainer
