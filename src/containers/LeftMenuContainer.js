import { connect } from 'react-redux'
import { batchActions } from 'redux-batched-actions/lib/index'
import LeftMenu from '../components/menu/LeftMenu'
import * as viewModesKeys from '../constants/viewModesKeys'
import { viewModes, layers, webMap, print } from '../store/actions'
import { canEditSelector, layerNameSelector } from '../store/selectors'
import { catchErrors } from '../store/actions/asyncAction'

const mapStateToProps = (store) => {
  const {
    viewModes: {
      [viewModesKeys.subordinationLevel]: isShowSubordinationLevel,
    },
    webMap: { subordinationLevel, isMeasureOn },
    print: { printFiles },
  } = store

  const layerName = layerNameSelector(store)
  const isEditMode = canEditSelector(store)
  return {
    isEditMode,
    isShowSubordinationLevel,
    isMeasureOn,
    subordinationLevel,
    layerName,
    printFilesCount: printFiles ? Object.keys(printFiles).length : null,
  }
}
const mapDispatchToProps = {
  onChangeEditMode: (editMode) => layers.setEditMode(editMode),
  onClickSubordinationLevel: () => viewModes.viewModeToggle(viewModesKeys.subordinationLevel),
  onMeasureChange: (isMeasureOn) => webMap.setMeasure(isMeasureOn),
  createPrintFile: () => print.createPrintFile(),
  onSubordinationLevelClose: () => viewModes.viewModeDisable(viewModesKeys.subordinationLevel),
  onSubordinationLevelChange: (subordinationLevel) => batchActions([
    webMap.setSubordinationLevel(subordinationLevel),
    viewModes.viewModeDisable(viewModesKeys.subordinationLevel),
  ]),
}
const LeftMenuContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps)
)(LeftMenu)

export default LeftMenuContainer
