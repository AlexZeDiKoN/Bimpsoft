import { createSelector } from 'reselect'
import { isEnemy } from '../../utils/affiliations'
import * as i18n from '../../i18n/ua'
import * as ENTITY from '../../components/WebMap/entityKind'
import { canEditSelector, layersById } from './layersSelector'
import { currentMapLayers } from './targeting'

const selectedObject = ({ selection: { list } }) => list.length === 1 && list[0]
const activeLayer = ({ layers: { selectedId } }) => selectedId
const objects = ({ webMap: { objects } }) => objects

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
    if (!selectedObject || selectedObject.layer !== layer) {
      return null
    }
    return selected
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
        if (Boolean(engagementBar) && isEnemy(code)) {
          result[object.id] = {
            id: object.id,
            name: engagementBar,
            code: object.code,
            attributes: object.attributes,
          }
        } else if (!layer.formationId) {
          const isArea = ENTITY.GROUPS.AREAS.includes(object.type)
          result[object.id] = {
            id: object.id,
            name: isArea ? i18n.AREA : i18n.FRONTIER,
            code: object.code,
            attributes: object.attributes,
          }
        }
      }
    }
    return result
  },
)
