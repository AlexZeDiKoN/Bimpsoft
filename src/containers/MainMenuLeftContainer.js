import memoizeOne from 'memoize-one'
import MainMenu from '../components/MainMenu/index'
import commands from '../constants/commands'
import SelectionTypes from '../constants/SelectionTypes'
import { withCommands } from '../hocs/withCommands'
import i18n from '../i18n'
import { selection } from '../store/actions'

const commandToItemData = (name) => {
  const { title, icon } = commands[name]
  return { title, icon: icon || 'question', key: name }
}

const getItems = memoizeOne((isEdit, templatesById) => {
  if (isEdit) {
    const templates = Object.values(templatesById).map((template) => ({
      key: template.id,
      title: template.name,
      milsymbol: template,
    }))
    return [
      commandToItemData('toggleEditMode'),
      {
        icon: 'flag',
        key: 'pointSign',
        title: i18n.POINT_SIGN,
        items: [
          ...templates,
          commandToItemData('addPointSignTemplate'),
        ],
      },
      {
        icon: 'share-alt',
        key: 'lineSign',
        title: i18n.LINE_SIGN,
        items: [
          commandToItemData('addShapePolyline'),
          commandToItemData('addShapeCurve'),
          commandToItemData('addShapePolygon'),
          commandToItemData('addShapeArea'),
          commandToItemData('addShapeRectangle'),
          commandToItemData('addShapeCircle'),
          commandToItemData('addShapeSquare'),
          commandToItemData('addShapeText'),
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
      commandToItemData('tempCommandShowForm'),
    ]
  } else {
    return [
      commandToItemData('toggleEditMode'),
      commandToItemData('togglePrintMode'),
    ]
  }
})

const getCommands = memoizeOne((byIds) => {
  const symbolCommands = {}
  Object.keys(byIds).forEach((id) => {
    const data = { ...byIds[id] }
    delete data.id
    data.type = SelectionTypes.POINT
    symbolCommands[id] = {
      key: id,
      action: selection.setSelection(data),
      checkedSelector: (state) => state.selection && state.selection.data === data,
    }
  })
  return {
    ...commands,
    ...symbolCommands,
  }
})

const withCommandsConnection = withCommands(
  (store) => getCommands(store.templates.byIds),
  (store) => getItems(store.viewModes.edit, store.templates.byIds)
)
export default withCommandsConnection(MainMenu)
