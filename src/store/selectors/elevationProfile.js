import {createSelector} from "reselect";
import * as R from "ramda";

export const getElProfileData = ({ elevationProfile }) => elevationProfile.elProfileData
export const getStraightLineState = ({ elevationProfile }) => elevationProfile.showStraightLine
export const getShowModalState = ({ elevationProfile }) => elevationProfile.isModalOpen

export const getElProfileDataWithStraightLine = createSelector(
  getElProfileData,
  getStraightLineState,
  (elProfileData, isShowStraightLine) => {
    const points = R.pathOr([], ['points'], elProfileData)
    const length = R.pathOr(0, ['length'], elProfileData)
    const onePartLength = length / points.length
    let normalizeData = {
      length,
      points: points.map((point, index) => ({
        x: onePartLength * index,
        y: point.z,
      }))
    }

    if(isShowStraightLine) {
      normalizeData.straightLine = [
        normalizeData.points[0],
        normalizeData.points[normalizeData.points.length - 1],
      ]
    }

    return normalizeData
  },
)
