import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import LeftMenu from '../components/menu/LeftMenu'
import * as viewModesKeys from '../constants/viewModesKeys'
import * as viewModesActions from '../store/actions/viewModes'
import * as webMapActions from '../store/actions/webMap'
import * as selectionActions from '../store/actions/selection'

const layerNameSelector = createSelector(
  (state) => state.layers,
  (state) => state.maps,
  (layers, maps) => {
    const { byId, selectedId } = layers
    if (selectedId === null) {
      return ''
    }
    const layer = byId[selectedId]
    if (!layer) {
      return ''
    }

    const map = maps.byId[layer.mapId]
    if (!map) {
      return layer.name
    }
    return `${map.name} / ${layer.name}`
  }
)

const mapStateToProps = (store) => {
  const {
    viewModes: {
      [viewModesKeys.edit]: isEditMode,
      // [viewModesKeys.pointSignsList]: isShowPoints,
      [viewModesKeys.mapSourcesList]: isShowSources,
      [viewModesKeys.lineSignsList]: isShowLines,
      [viewModesKeys.subordinationLevel]: isShowSubordinationLevel,
    },
    selection: { newShape },
    webMap: { subordinationLevel, isMeasureOn },
  } = store

  const layerName = layerNameSelector(store)

  return {
    isEditMode,
    // isShowPoints,
    isShowSources,
    isShowLines,
    isShowSubordinationLevel,
    isMeasureOn,
    newShape,
    subordinationLevel,
    layerName,
  }
}
const mapDispatchToProps = {
  onClickEditMode: () => viewModesActions.viewModeToggle(viewModesKeys.edit),
  // onClickPointSign: () => (dispatch, getState) => {
  //   const {
  //     viewModes: { [viewModesKeys.pointSignsList]: isShowPoints },
  //     selection: { newShape },
  //   } = getState()
  //
  //   if (isShowPoints) {
  //     if (newShape && newShape.type !== SelectionTypes.POINT) {
  //       dispatch(selectionActions.setNewShape({ type: SelectionTypes.POINT }))
  //     } else {
  //       dispatch(viewModesActions.viewModeDisable(viewModesKeys.pointSignsList))
  //       dispatch(selectionActions.setNewShape({}))
  //     }
  //   } else {
  //     dispatch(selectionActions.setNewShape({ type: SelectionTypes.POINT }))
  //     dispatch(viewModesActions.viewModeToggle(viewModesKeys.pointSignsList))
  //   }
  // },
  onClickMapSource: () => viewModesActions.viewModeToggle(viewModesKeys.mapSourcesList),
  onClickLineSign: () => viewModesActions.viewModeToggle(viewModesKeys.lineSignsList),
  onLinesListClose: () => viewModesActions.viewModeDisable(viewModesKeys.lineSignsList),
  onClickSubordinationLevel: () => viewModesActions.viewModeToggle(viewModesKeys.subordinationLevel),
  onMeasureChange: (isMeasureOn) => webMapActions.setMeasure(isMeasureOn),
  onSubordinationLevelClose: () => viewModesActions.viewModeDisable(viewModesKeys.subordinationLevel),
  onNewShapeChange: (newShape) => selectionActions.setNewShape(newShape),
  onSubordinationLevelChange: (subordinationLevel) => (dispatch) => {
    dispatch(webMapActions.setSubordinationLevel(subordinationLevel))
    dispatch(viewModesActions.viewModeDisable(viewModesKeys.subordinationLevel))
  },
}
const LeftMenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftMenu)

export default LeftMenuContainer
