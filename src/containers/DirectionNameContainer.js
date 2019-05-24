import { connect } from 'react-redux'
import { directionName } from '../constants/viewModesKeys'
import { viewModeDisable } from '../store/actions/viewModes'
import { updateObjectAttributes } from '../store/actions/webMap'
import { deselectDirection } from '../store/actions/flexGrid'
import DirectionNameForm from '../components/DirectionNameForm'
import { flexGridAttributes } from '../store/selectors'

const mapStateToProps = (store) => ({
  visible: store.viewModes[directionName],
  attributes: flexGridAttributes(store),
  id: store.flexGrid.flexGrid.id,
  index: store.flexGrid.selectedDirections.main,
})

const mapDispatchToProps = {
  hideModal: viewModeDisable,
  deselectDirection,
  updateObjectAttributes,
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { id, index, attributes, ...restState } = stateProps
  const { directionNames } = attributes || {}
  const { updateObjectAttributes, hideModal, deselectDirection } = dispatchProps
  const defaultName = directionNames && directionNames.get(index)

  return {
    ...ownProps,
    ...restState,
    defaultName,
    onSubmit: (name) => {
      if (name !== defaultName) {
        attributes.directionNames = directionNames.set(index, name)
        return updateObjectAttributes(id, attributes)
      }
    },
    onClose: () => {
      hideModal(directionName)
      deselectDirection()
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DirectionNameForm)
