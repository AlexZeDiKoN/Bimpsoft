import { connect } from 'react-redux'
import { directionName } from '../constants/viewModesKeys'
import { viewModeDisable } from '../store/actions/viewModes'
import { updateObjectAttributes } from '../store/actions/webMap'
import { deselectDirection } from '../store/actions/flexGrid'
import DirectionNameForm from '../components/DirectionNameForm'

const mapStateToProps = (store) => {
  const index = store.flexGrid.selectedDirections.current
  const namesList = store.flexGrid.flexGrid.directionNames
  return ({
    visible: store.viewModes[directionName],
    defaultName: namesList.get(index),
    flexGrid: store.flexGrid.flexGrid,
    index,
  })
}
const mapDispatchToProps = {
  hideModal: viewModeDisable,
  deselectDirection,
  updateObjectAttributes,
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { flexGrid, index, ...restState } = stateProps
  const { id, zones, directions, directionNames: list } = flexGrid || {}
  const { updateObjectAttributes, hideModal, deselectDirection } = dispatchProps

  return {
    ...ownProps,
    ...restState,
    onSubmit: (name) => {
      const directionNames = list.set(index, name).toArray()
      const attributes = { zones, directions, directionNames }
      return updateObjectAttributes(id, { attributes })
    },
    onClose: () => {
      hideModal(directionName)
      deselectDirection({ index, clearMain: true })
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DirectionNameForm)
