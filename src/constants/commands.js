import * as viewModesActions from '../store/actions/viewModes'
import * as templatesActions from '../store/actions/templates'
import * as selectionActions from '../store/actions/selection'
import i18n from '../i18n'
import * as viewModesKeys from './viewModesKeys'

export default {
  toggleEditMode: {
    title: i18n.EDIT_MODE,
    icon: 'edit',
    checkedSelector: (state) => state.viewModes.edit,
    action: viewModesActions.viewModeToggle(viewModesKeys.edit),
  },
  toggleTextMode: {
    title: i18n.ADD_TEXT,
    icon: 'file-text',
    checkedSelector: (state) => state.viewModes.text,
    action: viewModesActions.viewModeToggle(viewModesKeys.text),
  },
  togglePrintMode: {
    title: i18n.PRINT,
    icon: 'printer',
    checkedSelector: (state) => state.viewModes.print,
    action: viewModesActions.viewModeToggle(viewModesKeys.print),
  },
  toggleRightPanel: {
    title: i18n.TOGGLE_SIDEBAR,
    icon: 'database',
    checkedSelector: (state) => state.viewModes.rightPanel,
    action: viewModesActions.viewModeToggle(viewModesKeys.rightPanel),
  },
  toggleSettings: {
    title: i18n.SETTINGS,
    icon: 'setting',
    checkedSelector: (state) => state.viewModes.settings,
    action: viewModesActions.viewModeToggle(viewModesKeys.settings),
  },
  addPointSignTemplate: {
    title: i18n.ADD_POINT_SIGN_TEMPLATE,
    icon: 'plus',
    action: templatesActions.setSelectedTemplate({}),
  },
  tempCommandShowForm: {
    title: 'Emulate click to the map',
    icon: 'environment',
    action: selectionActions.showForm(),
  },
}
