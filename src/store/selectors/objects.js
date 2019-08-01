import { createSelector } from 'reselect'
import { canEditSelector, mapId } from './layersSelector'
import { currentMapLayers } from './targeting'
import { IDENTITIES, getIdentity } from '../../utils/affiliations'

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
  (objects, layers) => {
    const result = {}
    objects = objects.values()
    for (const object of objects) {
      const { code, layer, attributes: { engagementBar } } = object
      if (
        Boolean(engagementBar)
        && [
          IDENTITIES.SUSPECT_JOKER,
          IDENTITIES.HOSTILE_FAKER,
        ].includes(getIdentity(code)) // is enemy
        && layers.includes(layer)
      ) {
        result[object.id] = {
          id: object.id,
          name: engagementBar,
          code: object.code,
          attributes: object.attributes,
        }
      }
    }
    return result
  },
)
