import PropTypes from 'prop-types'
import { Record as ImmutableRecord } from 'immutable'

const ApplicationState = ImmutableRecord({
  isMapEditMode: false,
})

export default function applicationState (state = new ApplicationState(), action) {
  const { type } = action
  switch (type) {
    default:
      return state
  }
}

export const propTypes = PropTypes.shape({
  isMapEditMode: PropTypes.string.isRequired,
})
