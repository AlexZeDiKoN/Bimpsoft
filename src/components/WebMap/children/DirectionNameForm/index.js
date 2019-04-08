import { connect } from 'react-redux'
import { directionName } from '../../../../constants/viewModesKeys'
import { viewModeDisable } from '../../../../store/actions/viewModes'
import { setDirectionName } from '../../../../store/actions/flexGrid'
import DirectionNameForm from './DirectionName'

const mapStateToProps = (store) => ({
  id: store.viewModes[directionName],
  namesList: store.flexGrid.flexGrid.directionNames,
})
const mapDispatchToProps = (dispatch) => ({
  onClose: () => dispatch(viewModeDisable(directionName)),
  onSubmit: (prop) => dispatch(setDirectionName(prop)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DirectionNameForm)
