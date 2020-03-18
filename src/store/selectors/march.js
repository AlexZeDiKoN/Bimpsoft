import { createSelector } from 'reselect'

const marchDotsSelector = ({ march: { segments } }) => segments.toArray()

export const marchDots = createSelector(
  marchDotsSelector,
  (segments) => {

  }
)