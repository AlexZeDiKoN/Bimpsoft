import { connect } from 'react-redux'

export const withCommands = (getCommands, getItems) => (WrappedComponent) => {
  let commands
  const mapStateToProps = (store) => {
    const selectedKeys = []
    commands = getCommands(store)
    for (const key in commands) {
      const command = commands[key]
      const checked = command.checkedSelector && command.checkedSelector(store)
      if (checked) {
        selectedKeys.push(key)
      }
    }
    const items = getItems(store)
    return {
      selectedKeys,
      items,
    }
  }

  const mapDispatchToProps = (dispatch) => ({
    onAction: (key) => {
      const command = commands[key]
      if (command && command.action) {
        dispatch(command.action)
      }
    },
  })
  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(WrappedComponent)
}
