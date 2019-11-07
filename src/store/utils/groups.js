import { model } from '@DZVIN/MilSymbolEditor'
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
