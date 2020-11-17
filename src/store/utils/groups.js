import { model } from '@C4/MilSymbolEditor'
import { isFriendObject } from '../../utils/affiliations'

export const determineGroupType = (objects) => {
  const CPList = objects
    .filter(({ code }) => model.APP6Code.isCommandPost(code))
  const nonCPList = objects
    .filter(({ code }) => !model.APP6Code.isCommandPost(code))
  if (nonCPList.length === 0 && CPList.length >= 1) {
    const friend = isFriendObject(CPList[0])
    const layer = CPList[0].layer
    if (CPList.length === 1 || CPList.every((object) => isFriendObject(object) === friend &&
      object.layer === layer)
    ) {
      return 'head'
    }
  }
  if (CPList.length === 0 && nonCPList.length >= 1) {
    const friend = isFriendObject(nonCPList[0])
    const layer = nonCPList[0].layer
    if (nonCPList.length === 1 || nonCPList.every((object) => isFriendObject(object) === friend &&
      object.layer === layer &&
      model.APP6Code.getSymbol(object.code) === model.app6Data.symbolKeys.LAND_UNIT)
    ) {
      return 'land'
    }
  }
}

export const emptyParent = (objects) => !objects.some(({ parent }) => parent)

// проверка на принадлежность всех объектов списка к слою commonLayer
export const sameLayer = (objects, commonLayer) => objects.every(({ layer }) => commonLayer === layer)

// По списку ID объектов проверка принадлежности сответствующих объектов к активному слою карты
export const objectsSameLayer = (selectedList, objectsMap, layerId) => {
  return layerId && selectedList.every((id) => layerId === objectsMap.getIn([ id, 'layer' ]))
}
