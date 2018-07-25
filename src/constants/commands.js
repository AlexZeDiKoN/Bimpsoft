import * as viewModesActions from '../store/actions/viewModes'
import * as templatesActions from '../store/actions/templates'
import * as selectionActions from '../store/actions/selection'
import * as SelectionTypes from '../constants/SelectionTypes'
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
  addShapeLine: {
    title: i18n.SHAPE_LINE,
    icon: 'share-alt',
    checkedSelector: (state) => state.selection.data && state.selection.data.type === SelectionTypes.SHAPE_LINE,
    action: selectionActions.setSelection({ type: SelectionTypes.SHAPE_LINE }),
  },
  addShapePath: {
    title: i18n.SHAPE_PATH,
    icon: 'share-alt',
    checkedSelector: (state) => state.selection.data && state.selection.data.type === SelectionTypes.SHAPE_PATH,
    action: selectionActions.setSelection({ type: SelectionTypes.SHAPE_PATH }),
  },
  addShapePolyhedron: {
    title: i18n.SHAPE_POLYHEDRON,
    icon: 'share-alt',
    checkedSelector: (state) => state.selection.data && state.selection.data.type === SelectionTypes.SHAPE_POLYHEDRON,
    action: selectionActions.setSelection({ type: SelectionTypes.SHAPE_POLYHEDRON }),
  },
  addShapePolygon: {
    title: i18n.SHAPE_POLYGON,
    icon: 'share-alt',
    checkedSelector: (state) => state.selection.data && state.selection.data.type === SelectionTypes.SHAPE_POLYGON,
    action: selectionActions.setSelection({ type: SelectionTypes.SHAPE_POLYGON }),
  },
  addShapeRectangle: {
    title: i18n.SHAPE_RECTANGLE,
    icon: 'share-alt',
    checkedSelector: (state) => state.selection.data && state.selection.data.type === SelectionTypes.SHAPE_RECTANGLE,
    action: selectionActions.setSelection({ type: SelectionTypes.SHAPE_RECTANGLE }),
  },
  addShapeCircle: {
    title: i18n.SHAPE_CIRCLE,
    icon: 'share-alt',
    checkedSelector: (state) => state.selection.data && state.selection.data.type === SelectionTypes.SHAPE_CIRCLE,
    action: selectionActions.setSelection({ type: SelectionTypes.SHAPE_CIRCLE }),
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
