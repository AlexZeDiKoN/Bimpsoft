import { connect } from 'react-redux'
import { directionName } from '../constants/viewModesKeys'
import { viewModeDisable } from '../store/actions/viewModes'
import { updateObjectAttributes } from '../store/actions/webMap'
import { setDirectionName } from '../store/actions/flexGrid'
import DirectionNameForm from '../components/DirectionNameForm'

// @TODO: закончить мержпропс!
const mapStateToProps = (store) => {
  const index = store.flexGrid.selectedDirections[0]
  const namesList = store.flexGrid.flexGrid.directionNames
  return ({
    visible: store.viewModes[directionName],
    defaultName: namesList.get(index),
    layerId: store.flexGrid.flexGrid.id,
    flexGrid: store.flexGrid.flexGrid,
    index,
  })
}
const mapDispatchToProps = (dispatch) => ({
  onClose: () => dispatch(viewModeDisable(directionName)),
  updateObjectAttributes: (id, attributes) => dispatch(updateObjectAttributes(id, attributes)),
  setDirectionName: () => dispatch(setDirectionName()),
})

// @TODO: updateObjectAttributes, delete c.log's
const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { flexGrid: { id, zones, directions, directionNames: list }, index, ...restState } = stateProps || {}
  const { updateObjectAttributes, setDirectionName, ...restDispatch } = dispatchProps

  const onSubmit = (name) => {
    console.info(name)
    const directionNames = list.set(index, name).toArray()
    const attributes = { zones, directions, directionNames }
    return setDirectionName(id, attributes)
  }
  console.info('stateProps', stateProps)
  console.info('dispatchProps', dispatchProps)
  return {
    index,
    ...restState,
    ...restDispatch,
    onSubmit,
    ...ownProps,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DirectionNameForm)
