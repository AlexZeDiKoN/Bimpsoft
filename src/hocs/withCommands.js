import { connect } from 'react-redux'

export const withCommands = (commands, getItems) => (WrappedComponent) => {
  const mapStateToProps = (store) => {
    const selectedKeys = []
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
  const withStoreConnection = connect(mapStateToProps, mapDispatchToProps)
  return withStoreConnection(WrappedComponent)
}
