import * as viewModesActions from '../store/actions/viewModes'
import * as templatesActions from '../store/actions/templates'
import * as selectionActions from '../store/actions/selection'
import SelectionTypes from '../constants/SelectionTypes'
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
  addShapePolyline: {
    title: i18n.SHAPE_POLYLINE,
    icon: 'share-alt',
    checkedSelector: (state) => state.selection.data && state.selection.data.type === SelectionTypes.POLYLINE,
    action: selectionActions.setSelection({ type: SelectionTypes.POLYLINE }),
  },
  addShapeCurve: {
    title: i18n.SHAPE_CURVE,
    icon: 'share-alt',
    checkedSelector: (state) => state.selection.data && state.selection.data.type === SelectionTypes.CURVE,
    action: selectionActions.setSelection({ type: SelectionTypes.CURVE }),
  },
  addShapePolygon: {
    title: i18n.SHAPE_POLYGON,
    icon: 'share-alt',
    checkedSelector: (state) => state.selection.data && state.selection.data.type === SelectionTypes.POLYGON,
    action: selectionActions.setSelection({ type: SelectionTypes.POLYGON }),
  },
  addShapeArea: {
    title: i18n.SHAPE_AREA,
    icon: 'share-alt',
    checkedSelector: (state) => state.selection.data && state.selection.data.type === SelectionTypes.AREA,
    action: selectionActions.setSelection({ type: SelectionTypes.AREA }),
  },
  addShapeRectangle: {
    title: i18n.SHAPE_RECTANGLE,
    icon: 'share-alt',
    checkedSelector: (state) => state.selection.data && state.selection.data.type === SelectionTypes.RECTANGLE,
    action: selectionActions.setSelection({ type: SelectionTypes.RECTANGLE }),
  },
  addShapeCircle: {
    title: i18n.SHAPE_CIRCLE,
    icon: 'share-alt',
    checkedSelector: (state) => state.selection.data && state.selection.data.type === SelectionTypes.CIRCLE,
    action: selectionActions.setSelection({ type: SelectionTypes.CIRCLE }),
  },
  addShapeSquare: {
    title: i18n.SHAPE_SQUARE,
    icon: 'share-alt',
    checkedSelector: (state) => state.selection.data && state.selection.data.type === SelectionTypes.SQUARE,
    action: selectionActions.setSelection({ type: SelectionTypes.SQUARE }),
  },
  addShapeText: {
    title: i18n.SHAPE_TEXT,
    icon: 'share-alt',
    checkedSelector: (state) => state.selection.data && state.selection.data.type === SelectionTypes.TEXT,
    action: selectionActions.setSelection({ type: SelectionTypes.TEXT }),
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
