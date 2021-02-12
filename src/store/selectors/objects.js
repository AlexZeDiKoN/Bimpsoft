import { createSelector } from 'reselect'
import { isEnemyObject } from '../../utils/affiliations'
import * as i18n from '../../i18n/ua'
import * as ENTITY from '../../components/WebMap/entityKind'
import { DESTROY_COMMAND_SIGN } from '../actions/task'
import { canEditSelector, layersById, currentMapLayers } from './layersSelector'

const selectedObject = ({ selection: { list } }) => list.length === 1 && list[0]
const activeLayer = ({ layers: { selectedId } }) => selectedId
const objects = ({ webMap: { objects } }) => objects
export const getObjectsInfo = ({ webMap: { objectsInfo } }) => objectsInfo
const undo = ({ webMap: { undoRecords, undoPosition } }) => ({
  size: undoRecords.size,
  position: undoPosition,
})

export const activeObjectId = createSelector(
  canEditSelector,
  selectedObject,
  objects,
  activeLayer,
  (edit, selected, objects, layer) => {
    if (!selected || !edit || !layer) {
      return null
    }
    const selectedObject = objects.get(selected)
    if (selectedObject && selectedObject.layer === layer) {
      return selected
    }
    return null
  },
)

export const targetObjects = createSelector(
  objects,
  currentMapLayers,
  layersById,
  (objects, currentLayers, layers) => {
    const result = {}
    objects = objects.values()
    for (const object of objects) {
      const { code, attributes: { engagementBar } } = object
      if (currentLayers.includes(object.layer)) {
        const layer = layers[object.layer]
        if (
          (Boolean(engagementBar) && isEnemyObject(object)) ||
          (!layer.formationId && code !== DESTROY_COMMAND_SIGN)
        ) {
          const name = engagementBar || (ENTITY.GROUPS.AREAS.includes(object.type)
            ? i18n.AREA
            : ENTITY.GROUPS.POINTS.includes(object.type)
              ? i18n.LOCATION
              : i18n.FRONTIER)
          result[object.id] = {
            id: object.id,
            name,
            code: object.code,
            attributes: object.attributes,
            type: object.type,
          }
        }
      }
    }
    return result
  },
)

export const undoInfo = createSelector(
  undo,
  ({ size, position }) => ({
    canUndo: position > 0,
    canRedo: position < size,
  })
)

export const sameObjects = (rules, objects) => {
  return objects.filter((value) => (
    value.layer === rules.layerId &&
    value.type === rules.type &&
    value.unit === rules.unit &&
    value.code === rules.code
  ))
}
