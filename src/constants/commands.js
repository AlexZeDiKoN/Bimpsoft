import * as viewModesActions from '../store/actions/viewModes'
import * as viewModesKeys from './viewModesKeys'

export default {
  toggleEditMode: {
    title: 'Режим роботи',
    icon: 'edit',
    checkedSelector: (state) => state.viewModes.edit,
    action: viewModesActions.viewModeToggle(viewModesKeys.edit),
  },
  toggleTextMode: {
    title: 'Додати надпис',
    icon: 'file-text',
    checkedSelector: (state) => state.viewModes.text,
    action: viewModesActions.viewModeToggle(viewModesKeys.text),
  },
  togglePrintMode: {
    title: 'Друк',
    icon: 'printer',
    checkedSelector: (state) => state.viewModes.print,
    action: viewModesActions.viewModeToggle(viewModesKeys.print),
  },
  toggleRightPanel: {
    title: 'Відобразити/сховати праву панель',
    icon: 'database',
    checkedSelector: (state) => state.viewModes.rightPanel,
    action: viewModesActions.viewModeToggle(viewModesKeys.rightPanel),
  },
  toggleSettings: {
    title: 'Налаштування',
    icon: 'setting',
    checkedSelector: (state) => state.viewModes.settings,
    action: viewModesActions.viewModeToggle(viewModesKeys.settings),
  },
}
