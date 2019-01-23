import { createSelector } from 'reselect'

const theSame = (value) => value
const optionsForm = ({ flexGrid: { options } }) => options
const visibleFlag = ({ flexGrid: { visible } }) => visible
const optionDirections = ({ flexGrid: { directions } }) => directions
const optionZones = ({ flexGrid: { zones } }) => zones !== 1
const optionZonesNum = ({ flexGrid: { zones } }) => zones
const optionVertical = ({ flexGrid: { vertical } }) => vertical

export const showFlexGridOptions = createSelector(
  optionsForm,
  theSame
)

export const flexGridVisible = createSelector(
  visibleFlag,
  theSame
)

export const flexGridOptions = createSelector(
  optionDirections,
  optionZones,
  optionVertical,
  (directions, zones, vertical) => ({ directions, zones, vertical })
)

export const flexGridParams = createSelector(
  optionDirections,
  optionZonesNum,
  optionVertical,
  (directions, zones, vertical) => ({ directions, zones, vertical })
)
