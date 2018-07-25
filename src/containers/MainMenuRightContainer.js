import MainMenu from '../components/MainMenu/index'
import commands from '../constants/commands'
import { withCommands } from '../hocs/withCommands'

const commandToItemData = (name) => {
  const { title, icon } = commands[name]
  return { title, icon: icon || 'question', key: name }
}

const items = [
  commandToItemData('toggleRightPanel'),
  commandToItemData('toggleSettings'),
]
const withCommandsConnection = withCommands(() => commands, () => items)
export default withCommandsConnection(MainMenu)
