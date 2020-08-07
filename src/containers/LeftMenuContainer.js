import { connect } from 'react-redux'
import { batchActions } from 'redux-batched-actions'
import LeftMenu from '../components/menu/LeftMenu'
import * as viewModesKeys from '../constants/viewModesKeys'
import { viewModes, layers, webMap, task, selection } from '../store/actions'
import {
  canEditSelector, layerNameSelector, mapCOP, targetingModeSelector, taskModeSelector,
} from '../store/selectors'
import { catchErrors } from '../store/actions/asyncAction'
import { MapModes } from '../constants'
import { SET_SEARCH_OPTIONS } from '../store/actions/viewModes'

const mapStateToProps = (store) => {
  const {
    viewModes: {
      [viewModesKeys.subordinationLevel]: isShowSubordinationLevel,
      [viewModesKeys.map3D]: is3DMapMode,
      searchEmpty: searchFailed,
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
    is3DMapMode,
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
    searchFailed,
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
  onSearch: (sample) => viewModes.search(sample),
  onCoordinates: (text, point) => webMap.setMarker({ text, point }),
  onManyCoords: (list) => ({
    type: SET_SEARCH_OPTIONS,
    payload: list,
  }),
  onClearSearchError: () => viewModes.searchClearError,
  onCloseSearch: () => viewModes.searchCloseList,
  onChangeTargetingMode: (targetingMode) => webMap.setMapMode(targetingMode ? MapModes.TARGET : MapModes.NONE),
  onChangeTaskMode: (taskMode) => taskMode
    ? batchActions([
      webMap.setMapMode(MapModes.TASK),
      task.setFriendObject(null),
      selection.selectedList([]),
    ])
    : webMap.setMapMode(MapModes.NONE),
  onClick3D: () => viewModes.viewModeToggle(viewModesKeys.map3D),
}
const LeftMenuContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps),
)(LeftMenu)

export default LeftMenuContainer
