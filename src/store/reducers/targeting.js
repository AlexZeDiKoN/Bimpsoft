import { Record } from 'immutable'
import { merge } from '../../utils/immutable'
import { targeting } from '../actions'

const Targeting = Record({
  targetingMode: false,
})

const initState = new Targeting()

export default function reducer (state = initState, action) {
  const { type } = action
  switch (type) {
    case targeting.SET_TARGETING_MODE: {
      const { payload: targetingMode } = action
      return merge(state, { targetingMode })
    }
    case targeting.TOGGLE_TARGETING_MODE: {
      return merge(state, { targetingMode: !state.targetingMode })
    }
    default: {
      return state
    }
  }
}
