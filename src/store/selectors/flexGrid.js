import { createSelector } from 'reselect'
import PropTypes from 'prop-types'

const theSame = (value) => value
const optionsForm = ({ flexGrid }) => flexGrid.options
const visibleFlag = ({ flexGrid }) => flexGrid.visible
const optionDirections = ({ flexGrid }) => flexGrid.flexGrid.directions
const optionZones = ({ flexGrid }) => flexGrid.flexGrid.zones
const optionVertical = ({ flexGrid }) => flexGrid.vertical
export const selectedDirections = ({ flexGrid }) => flexGrid.selectedDirections.toArray()
const data = ({ flexGrid: { flexGrid } }) => flexGrid

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
  (directions, zones, vertical) => ({ directions, zones: zones !== 1, vertical })
)

export const flexGridParams = createSelector(
  optionDirections,
  optionZones,
  optionVertical,
  selectedDirections,
  (directions, zones, vertical, selectedDirections) => ({ directions, zones, vertical, selectedDirections })
)

export const flexGridData = createSelector(
  data,
  theSame
)

export const geoPointPropTypes = PropTypes.shape({
  lat: PropTypes.number,
  lng: PropTypes.number,
})

export const flexGridPropTypes = PropTypes.shape({
  id: PropTypes.string,
  deleted: PropTypes.any,
  directions: PropTypes.number,
  zones: PropTypes.number,
  eternals: PropTypes.any,
  directionSegments: PropTypes.any,
  zoneSegments: PropTypes.any,
})
