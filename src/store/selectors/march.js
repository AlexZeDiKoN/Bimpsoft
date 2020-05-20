import { createSelector } from 'reselect'
import { MARCH_TYPES } from '../../constants/March'

const { OWN_RESOURCES, BY_RAILROAD, BY_SHIPS, COMBINED } = MARCH_TYPES

const getSegmentColor = (segmentType) => {
  switch (segmentType) {
    case (OWN_RESOURCES):
      return '#7d8160'
    case (BY_RAILROAD):
      return '#e58850'
    case (BY_SHIPS):
      return '#94D8FF'
    case (COMBINED):
      return '#5bb24e'
    default:
      return '#DFE3B4'
  }
}

const marchDotsSelector = ({ march: { segments } }) => segments

export const marchDots = createSelector(
  marchDotsSelector,
  (segments) => {
    const coordArray = []
    segments = segments ? segments.toArray() : []

    segments.forEach((it) => {
      if (it.coordinate.lat || it.coordinate.lng) {
        coordArray.push({ coordinate: it.coordinate, options: { color: getSegmentColor(it.segmentType) } })
      }
      if (it.children && it.children.length > 0) {
        it.children.forEach((it2) => {
          if (it2.coordinate.lat || it2.coordinate.lng) {
            coordArray.push({ coordinate: it2.coordinate, options: { color: getSegmentColor(it.segmentType) } })
          }
        })
      }
    })

    return coordArray
  },

)
