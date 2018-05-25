import PropTypes from 'prop-types'
import { Record as ImmutableRecord } from 'immutable'
import { actionNames } from '../actions/webMap'

const WebMapState = ImmutableRecord({
  isMapEditMode: false,
  isPointMarkEditMode: false,
  isTextMarkEditMode: false,
  isTimelineEditMode: false,
})

export default function webMapReducer (state = new WebMapState(), action) {
  let { type, payload } = action
  switch (type) {
    case actionNames.TOGGLE_MAP_EDIT_MODE:
      if (!payload) {
        payload = !state.get('isMapEditMode')
      }
      return state.merge({
        isMapEditMode: payload,
        isPointMarkEditMode: false,
        isTextMarkEditMode: false,
      })
    case actionNames.TOGGLE_POINT_MARK_EDIT_MODE:
      if (!payload) {
        payload = !state.get('isPointMarkEditMode')
      }
      return state.merge({
        isMapEditMode: false,
        isPointMarkEditMode: payload,
        isTextMarkEditMode: false,
      })
    case actionNames.TOGGLE_TEXT_MARK_EDIT_MODE:
      if (!payload) {
        payload = !state.get('isTextMarkEditMode')
      }
      return state.merge({
        isMapEditMode: false,
        isPointMarkEditMode: false,
        isTextMarkEditMode: payload,
      })
    case actionNames.TOGGLE_TIMELINE_EDIT_MODE:
      if (!payload) {
        payload = !state.get('isTimelineEditMode')
      }
      return state.set('isTimelineEditMode', payload)
    default:
      return state
  }
}

export const propTypes = PropTypes.shape({
  isMapEditMode: PropTypes.bool.isRequired,
  isPointMarkEditMode: PropTypes.bool.isRequired,
  isTextMarkEditMode: PropTypes.bool.isRequired,
  isTimelineEditMode: PropTypes.bool.isRequired,
})
