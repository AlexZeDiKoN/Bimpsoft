import { createSelector } from 'reselect'
import SubordinationLevel from '../../constants/SubordinationLevel'
import entityKind from '../../components/WebMap/entityKind'
import { mapId, layersById } from './layersSelector'

const targetingMode = (state) => state.targeting.targetingMode
const unitId = (state) => state.webMap.unitId
const objects = (state) => state.webMap.objects

const currentMapLayers = createSelector(
  mapId,
  layersById,
  (mapId, layers) => mapId && Object.values(layers)
    .map(([ key, value ]) => value.mapId === mapId ? key : null)
    .filter((value) => value !== null)
)

const currentMapPointLowLevelObjects = createSelector(
  objects,
  unitId,
  currentMapLayers,
  (objects, unitId, layers) => {
    const crews = objects.filter((object) => object.type === entityKind.POINT &&
      object.level === SubordinationLevel.TEAM_CREW && layers.includes(object.layer))

  }
)

export const targetingObjects = createSelector(
  targetingMode,
  unitId,
  () => {

  }
)
