import { createSelector } from 'reselect'

const getSegmentColor = (segmentType) => {
  switch (segmentType) {
    case (41):
      return '#7d8160'
    case (42):
      return '#e58850'
    case (43):
      return '#94D8FF'
    case (44):
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
    segments = segments.toArray()

    segments.forEach((it) => {
      if (it.coord.lat || it.coord.lng) {
        coordArray.push({ coord: it.coord, options: { color: getSegmentColor(it.segmentType) } })
      }
      if (it.children && it.children.length > 0) {
        it.children.forEach((it2) => {
          if (it2.coord.lat || it2.coord.lng) {
            coordArray.push({ coord: it2.coord, options: { color: getSegmentColor(it.segmentType) } })
          }
        })
      }
    })

    return coordArray
  },

)
