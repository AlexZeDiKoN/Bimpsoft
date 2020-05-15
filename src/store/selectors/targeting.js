import { createSelector } from 'reselect'
import SubordinationLevel from '../../constants/SubordinationLevel'
import entityKind from '../../components/WebMap/entityKind'
import { MapModes } from '../../constants'
import { isFriendObject } from '../../utils/affiliations'
import { currentMapLayers } from './layersSelector'

export const targetingModeSelector = (state) => state.webMap.mode === MapModes.TARGET
const unitId = (state) => state.webMap.unitId
const objects = (state) => state.webMap.objects
const defaultOrgStructure = (state) => state.webMap.defOrgStructure
const selectedList = (state) => state.selection.list
export const allUnits = (state) => state.orgStructures.unitsById

const selectedOur = (objects, list) => {
  if (list && list.length === 1) {
    const objId = list[0]
    const object = objects.get(objId)
    if (object && isFriendObject(object)) {
      return object.unit
    }
  }
}

const buildList = (orgStructure, myUnitId) => orgStructure.byIds[myUnitId] && orgStructure.byIds[myUnitId].children
  ? [
    myUnitId,
    ...orgStructure.byIds[myUnitId].children.map((child) => buildList(orgStructure, child)),
  ]
  : [ myUnitId ]

const myList = (orgStructure, myUnitId) => {
  const cp = orgStructure.byIds[myUnitId]
  cp && cp.itemType === 'CommandPost' && (myUnitId = cp.militaryUnitID)
  return buildList(orgStructure, myUnitId).flat(32)
}

const currentMapPointLowLevelObjects = createSelector(
  objects,
  currentMapLayers,
  (objects, layers) => objects
    .filter((object) => object.type === entityKind.POINT && object.level === SubordinationLevel.TEAM_CREW &&
      layers.includes(object.layer)),
)

export const targetingObjects = createSelector(
  targetingModeSelector,
  unitId,
  objects,
  currentMapPointLowLevelObjects,
  defaultOrgStructure,
  selectedList,
  (targetingMode, unitId, allObjects, pointObjects, orgStructure, selectedList) => {
    let predicate = () => false
    if (targetingMode && unitId && allObjects && pointObjects && orgStructure) {
      // const mySubList = myList(orgStructure.tree, unitId)
      const one = selectedOur(allObjects, selectedList)
      const oneSubList = one
        ? myList(orgStructure.tree, one, true)
        : null
      predicate = (object) => /* mySubList.includes(object.unit) && ( */oneSubList && oneSubList.includes(object.unit)/* ) */
    }
    return pointObjects.filter(predicate)
  },
)
