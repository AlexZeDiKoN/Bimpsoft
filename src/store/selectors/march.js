import { createSelector } from 'reselect'

const marchDotsSelector = ({ march: { segments } }) => segments.toArray()

export const marchDots = createSelector(
  marchDotsSelector,
  (segments) => {
    const coordArray = []

    segments.forEach((it) => {
      if (it.coord.lat && it.coord.lng) {
        coordArray.push(it.coord)
      }
      if (it.children && it.children.length > 0) {
        it.children.forEach((it2) => {
          if (it2.coord.lat && it2.coord.lng) {
            coordArray.push(it2.coord)
          }
        })
      }
    })

    return coordArray
  },

)
