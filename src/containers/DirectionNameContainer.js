import { connect } from 'react-redux'
import { List } from 'immutable'
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
  const { directionNames, mainDirectionSigns = List() } = attributes || {}
  const { updateObjectAttributes, hideModal, deselectDirection } = dispatchProps

  const defaultName = directionNames && directionNames.get(index)
  let defaultMainDirection = mainDirectionSigns.get(index)
  defaultMainDirection = defaultMainDirection || false
  return {
    ...ownProps,
    ...restState,
    defaultName,
    defaultMainDirection,
    onSubmit: (name, isMainDirection) => {
      if (name !== defaultName || isMainDirection !== defaultMainDirection) {
        attributes.directionNames = directionNames.set(index, name)
        const resetMainDirectionSigns = isMainDirection ? mainDirectionSigns.map(() => false) : mainDirectionSigns
        attributes.mainDirectionSigns = resetMainDirectionSigns.set(index, isMainDirection)
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
  mergeProps,
)(DirectionNameForm)
