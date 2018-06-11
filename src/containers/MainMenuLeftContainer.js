import MainMenu from '../components/MainMenu/index'
import commands from '../constants/commands'
import { withCommands } from '../hocs/withCommands'

const commandToItemData = (name) => {
  const { title, icon } = commands[name]
  return { title, icon: icon || 'question', key: name }
}

const menuItems = [
  commandToItemData('toggleEditMode'),
  commandToItemData('togglePrintMode'),
]

const menuItemsEdit = [
  commandToItemData('toggleEditMode'),
  {
    icon: 'flag',
    key: 'pointSign',
    title: 'Точковий знак',
    items: [
      { icon: 'paper-clip' },
      { icon: 'paper-clip' },
      { icon: 'paper-clip' },
      { icon: 'paper-clip' },
    ],
  },
  {
    icon: 'share-alt',
    key: 'lineSign',
    title: 'Відрізковий знак',
    items: [
      { icon: 'smile' },
      { icon: 'smile' },
      { icon: 'paper-clip' },
      { icon: 'paper-clip' },
    ],
  },
  {
    icon: 'star-o',
    key: 'polySign',
    title: 'Полілінійний/полігональний знак',
    items: [
      { icon: 'smile' },
      { icon: 'smile' },
      { icon: 'smile' },
      { icon: 'smile' },
    ],
  },
  commandToItemData('toggleTextMode'),
  commandToItemData('togglePrintMode'),
]

const getItems = (store) => {
  return store.viewModes.edit ? menuItemsEdit : menuItems
}

const withCommandsConnection = withCommands(commands, getItems)
export default withCommandsConnection(MainMenu)
