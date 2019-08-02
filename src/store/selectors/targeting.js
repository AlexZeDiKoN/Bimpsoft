import { createSelector } from 'reselect'
import SubordinationLevel from '../../constants/SubordinationLevel'
import entityKind from '../../components/WebMap/entityKind'
import { mapId, mapCOP, layersById } from './layersSelector'

const targetingMode = (state) => state.targeting.targetingMode
const unitId = (state) => state.webMap.unitId
const objects = (state) => state.webMap.objects
const currentOrgStructure = (state) => state.orgStructures

const myList = (orgStructure, myUnitId) => [
  myUnitId,
  ...((orgStructure.byIds[myUnitId] && orgStructure.byIds[myUnitId].children) || [])
    .map((child) => myList(orgStructure, child)),
].flat(32)

export const currentMapLayers = createSelector(
  mapId,
  layersById,
  (mapId, layers) => mapId && layers
    ? Object.entries(layers)
      .map(([ key, value ]) => value.visible && value.mapId === mapId ? key : null)
      .filter((value) => value !== null)
    : []
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
  mapCOP,
  unitId,
  currentMapPointLowLevelObjects,
  currentOrgStructure,
  (targetingMode, mapCOP, unitId, objects, orgStructure) => {
    let predicate = () => false
    if (targetingMode && mapCOP && unitId && objects && orgStructure) {
      const list = myList(orgStructure, unitId)
      predicate = (object) => list.includes(object.unit)
    }
    return objects.filter(predicate)
  }
)
