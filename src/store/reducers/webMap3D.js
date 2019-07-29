import { Record } from 'immutable'
import { actionNames } from '../actions/webMap3D'

const webMap3DState = Record({
  zoom: null,
})

const webMap3DReducer = (state = webMap3DState(), action) => {
  const { type, payload } = action

  switch (type) {
    case actionNames.SET_ZOOM:
      return state.set('zoom', payload)
    default:
      return state
  }
}

export default webMap3DReducer
