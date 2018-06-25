import MainMenu from '../components/MainMenu/index'
import commands from '../constants/commands'
import { withCommands } from '../hocs/withCommands'
import i18n from '../i18n'

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
    title: i18n.POINT_SIGN,
    items: [
      { key: 'pointSign1', icon: 'paper-clip' },
      { key: 'pointSign2', icon: 'paper-clip' },
      { key: 'pointSign3', icon: 'paper-clip' },
      { key: 'pointSign4', icon: 'paper-clip' },
    ],
  },
  {
    icon: 'share-alt',
    key: 'lineSign',
    title: i18n.LINE_SIGN,
    items: [
      { key: 'lineSign1', icon: 'smile' },
      { key: 'lineSign2', icon: 'smile' },
      { key: 'lineSign3', icon: 'paper-clip' },
      { key: 'lineSign4', icon: 'paper-clip' },
    ],
  },
  {
    icon: 'star-o',
    key: 'polySign',
    title: i18n.POLY_SIGN,
    items: [
      { key: 'polySign1', icon: 'smile' },
      { key: 'polySign2', icon: 'smile' },
      { key: 'polySign3', icon: 'smile' },
      { key: 'polySign4', icon: 'smile' },
    ],
  },
  commandToItemData('toggleTextMode'),
  commandToItemData('togglePrintMode'),
]

const getItems = (store) => store.viewModes.edit ? menuItemsEdit : menuItems

const withCommandsConnection = withCommands(commands, getItems)
export default withCommandsConnection(MainMenu)
