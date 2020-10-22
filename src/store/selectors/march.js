import { createSelector } from 'reselect'
import { MARCH_TYPES, MARCH_COLOR, MARCH_POINT_TYPES as pointTypes } from '../../constants/March'

const { OWN_RESOURCES, BY_RAILROAD, BY_SHIPS, COMBINED } = MARCH_TYPES
const { OWN_RESOURCES_LINE, BY_RAILROAD_LINE, BY_SHIPS_LINE, COMBINED_LINE, DEFAULT_LINE } = MARCH_COLOR
const pointRest = [ pointTypes.REST_POINT, pointTypes.DAY_NIGHT_REST_POINT, pointTypes.DAILY_REST_POINT ]

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
const marchActivePoint = ({ march: { activePoint } }) => activePoint

export const marchDots = createSelector(
  marchDotsSelector,
  marchActivePoint,
  (segments, marchActivePoint) => {
    const coordArray = []
    const { segmentId, childId } = marchActivePoint
    segments = segments ? segments.toArray() : []
    segments.forEach((it, id) => {
      if (it.coordinates.lat || it.coordinates.lng) {
        coordArray.push({
          coordinates: it.coordinates,
          options: { color: getSegmentColor(it.type) },
          refPoint: it.refPoint,
          route: it.route,
          isActivePoint: Boolean(segmentId === id && childId === null),
        })
      }
      if (it.children && it.children.length > 0) {
        it.children.forEach((it2, id2) => {
          if (it2.coordinates.lat || it2.coordinates.lng) {
            coordArray.push({
              coordinates: it2.coordinates,
              options: { color: getSegmentColor(it.type) },
              refPoint: it2.refPoint,
              route: it2.route,
              isRestPoint: pointRest.includes(it2.type),
              isActivePoint: Boolean(segmentId === id && childId === id2),
            })
          }
        })
      }
    })

    return coordArray
  },
)
