import { connect } from 'react-redux'
import LeftMenu from '../components/menu/LeftMenu'
import commandsSelector from '../constants/commandsSelector'

const mapStateToProps = (store) => {
  const commands = commandsSelector(store)
  return {
    commands,
  }
}
const mapDispatchToProps = (dispatch) => ({
  onCommand: (command) => {
    dispatch(command.action)
  },
})
const LeftMenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftMenu)

export default LeftMenuContainer
