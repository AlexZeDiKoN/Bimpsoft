import { components } from '@DZVIN/CommonComponents'
import { createSelector } from 'reselect'
import * as viewModesActions from '../store/actions/viewModes'
import * as selectionActions from '../store/actions/selection'
import SelectionTypes from '../constants/SelectionTypes'
import i18n from '../i18n'
import * as viewModesKeys from './viewModesKeys'

const iconNames = components.icons.names

const commandsSelector = createSelector(
  (state) => state.viewModes,
  (viewModes) => ({
    toggleEditMode: {
      title: i18n.EDIT_MODE,
      icon: viewModes.edit ? iconNames.EDIT_ACTIVE : iconNames.EDIT_DEFAULT,
      hoverIcon: iconNames.EDIT_HOVER,
      action: viewModesActions.viewModeToggle(viewModesKeys.edit),
    },
    togglePointSignsList: {
      title: i18n.POINT_SIGN,
      disabled: !viewModes.edit,
      icon: viewModes.pointSignsList ? iconNames.CONVENTIONAL_SIGN_ACTIVE : iconNames.CONVENTIONAL_SIGN_DEFAULT,
      hoverIcon: iconNames.CONVENTIONAL_SIGN_HOVER,
      action: viewModesActions.viewModeToggle(viewModesKeys.pointSignsList),
    },
    toggleLineSignsList: {
      title: i18n.LINE_SIGN,
      disabled: !viewModes.edit,
      icon: viewModes.lineSignsList
        ? iconNames.GROUPING_GRAPHIC_PRIMITIVES_ACTIVE
        : iconNames.GROUPING_GRAPHIC_PRIMITIVES_DEFAULT,
      hoverIcon: iconNames.GROUPING_GRAPHIC_PRIMITIVES_HOVER,
      action: viewModesActions.viewModeToggle(viewModesKeys.lineSignsList),
    },
    toggleTextMode: {
      title: i18n.ADD_TEXT,
      disabled: !viewModes.edit,
      icon: viewModes.text ? iconNames.TEXT_SIGN_ACTIVE : iconNames.TEXT_SIGN_DEFAULT,
      hoverIcon: iconNames.TEXT_SIGN_HOVER,
      action: viewModesActions.viewModeToggle(viewModesKeys.text),
    },
    togglePrintMode: {
      title: i18n.PRINT,
      icon: viewModes.print ? iconNames.TEXT_SIGN_ACTIVE : iconNames.TEXT_SIGN_DEFAULT,
      hoverIcon: iconNames.TEXT_SIGN_HOVER,
      action: viewModesActions.viewModeToggle(viewModesKeys.print),
    },
    toggleRightPanel: {
      title: i18n.TOGGLE_SIDEBAR,
      icon: viewModes.sidebar ? iconNames.LEFT_MENU_ACTIVE : iconNames.LEFT_MENU_DEFAULT,
      hoverIcon: iconNames.LEFT_MENU_HOVER,
      action: viewModesActions.viewModeToggle(viewModesKeys.sidebar),
    },
    toggleSettings: {
      title: i18n.SETTINGS,
      icon: viewModes.settings ? iconNames.SETTING_ACTIVE : iconNames.SETTING_DEFAULT,
      hoverIcon: iconNames.SETTING_HOVER,
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
  })
)

export default commandsSelector
