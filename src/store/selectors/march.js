import { createSelector } from 'reselect'
import { MARCH_TYPES, MARCH_COLOR } from '../../constants/March'

const { OWN_RESOURCES, BY_RAILROAD, BY_SHIPS, COMBINED } = MARCH_TYPES
const { OWN_RESOURCES_LINE, BY_RAILROAD_LINE, BY_SHIPS_LINE, COMBINED_LINE, DEFAULT_LINE } = MARCH_COLOR

const getSegmentColor = (segmentType) => {
  switch (segmentType) {
    case (OWN_RESOURCES):
      return OWN_RESOURCES_LINE
    case (BY_RAILROAD):
      return BY_RAILROAD_LINE
    case (BY_SHIPS):
      return BY_SHIPS_LINE
    case (COMBINED):
      return COMBINED_LINE
    default:
      return DEFAULT_LINE
  }
}

const marchDotsSelector = ({ march: { segments } }) => segments

export const marchDots = createSelector(
  marchDotsSelector,
  (segments) => {
    const coordArray = []
    segments = segments ? segments.toArray() : []

    segments.forEach((it) => {
      if (it.coordinates.lat || it.coordinates.lng) {
        coordArray.push({ coordinates: it.coordinates, options: { color: getSegmentColor(it.type) } })
      }
      if (it.children && it.children.length > 0) {
        it.children.forEach((it2) => {
          if (it2.coordinates.lat || it2.coordinates.lng) {
            coordArray.push({ coordinates: it2.coordinates, options: { color: getSegmentColor(it.type) } })
          }
        })
      }
    })

    return coordArray
  },

)
