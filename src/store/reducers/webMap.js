import PropTypes from 'prop-types'
import { Record as ImmutableRecord } from 'immutable'
import { actionNames } from '../actions/webMap'

const WebMapState = ImmutableRecord({
  isMapEditMode: false,
  isPointMarkMode: false,
})

export default function webMapReducer (state = new WebMapState(), action) {
  const { type } = action
  switch (type) {
    case actionNames.TOGGLE_MAP_EDIT_MODE:
      return state.set('isMapEditMode', !state.get('isMapEditMode'))
    case actionNames.TOGGLE_POINT_MARK_EDIT_MODE:
      return state.set('isPointMarkMode', !state.get('isPointMarkMode'))
    default:
      return state
  }
}

export const propTypes = PropTypes.shape({
  isMapEditMode: PropTypes.bool.isRequired,
})
