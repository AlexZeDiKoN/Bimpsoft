import { createSelector } from 'reselect'
import { POINT_SIZE_MAX, POINT_SIZE_MIN } from '../../constants/params'

const getParam = (name) => (state) => state.params[name]

export const pointSizesSelector = createSelector(
  [ getParam(POINT_SIZE_MIN), getParam(POINT_SIZE_MAX) ],
  (min, max) => ({ min: +min, max: +max })
)
