import {createSelector} from "reselect";
import * as R from "ramda";

export const getStraightLineState = ({ elevationProfile }) => elevationProfile.showStraightLine
export const getShowModalState = ({ elevationProfile }) => elevationProfile.isModalOpen
export const getZoneProfileData = ({ elevationProfile }) => elevationProfile.zoneProfileData

export const getElProfileDataWithStraightLine = createSelector(
  getZoneProfileData,
  getStraightLineState,
  (zoneProfileData, isShowStraightLine) => {
    const points = R.pathOr([], ['points'], zoneProfileData)
    const length = R.pathOr(0, ['length'], zoneProfileData)
    const heightObserver = R.pathOr(0, ['heightObserver'], zoneProfileData)
    const heightTarget = R.pathOr(0, ['heightTarget'], zoneProfileData)
    const onePartLength = length / points.length
    let normalizeData = {
      length,
      points: points.map((point, index) => {
        return {
          x: onePartLength * index,
          y: point.z,
        }
      })
    }
    if(isShowStraightLine) {
      const firstPoint = points[0]
      const lastPoint = R.last(points)
      const lastNormPoint = R.last(normalizeData.points)
      normalizeData.straightLine = [
        {
          x:0,
          y: firstPoint.z + heightObserver
        },
        {
          x: lastNormPoint.x,
          y: lastPoint.z + heightTarget
        },
      ]
    }
    return normalizeData
  },
)
