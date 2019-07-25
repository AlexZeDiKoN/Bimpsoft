import { createSelector } from 'reselect'
import SubordinationLevel from '../../constants/SubordinationLevel'
import entityKind from '../../components/WebMap/entityKind'
import { mapId, layersById } from './layersSelector'
import { currentOrgStructure } from './orgStructures'

const targetingMode = (state) => state.targeting.targetingMode
const unitId = (state) => state.webMap.unitId
const objects = (state) => state.webMap.objects

const myList = (orgStructure, myUnitId) => [
  myUnitId,
  ...(orgStructure.byIds[myUnitId].children || [])
    .map((child) => myList(orgStructure, child)),
]

const isMeOrMyChild = (object, myUnitId, orgStructure) => object && orgStructure && myUnitId &&
  myList(orgStructure, myUnitId).includes(Number(object.unit))

const currentMapLayers = createSelector(
  mapId,
  layersById,
  (mapId, layers) => mapId && Object.values(layers)
    .map(([ key, value ]) => value.mapId === mapId ? key : null)
    .filter((value) => value !== null)
)

const currentMapPointLowLevelObjects = createSelector(
  objects,
  currentMapLayers,
  (objects, layers) => objects
    .filter((object) => object.type === entityKind.POINT && object.level === SubordinationLevel.TEAM_CREW &&
      layers.includes(object.layer))
)

export const targetingObjects = createSelector(
  targetingMode,
  unitId,
  currentMapPointLowLevelObjects,
  currentOrgStructure,
  (targetingMode, unitId, objects, orgStructure) => targetingMode && unitId && objects && orgStructure &&
    objects.filter((object) => isMeOrMyChild(object, unitId, orgStructure))
)
