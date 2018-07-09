import { asyncAction, notifications } from '../actions'
import { ApiError } from '../../constants/errors'
import i18n from '../../i18n'

const initState = {}
let counter = 1

export default function reducer (state = initState, action) {
  const { type } = action
  switch (type) {
    case asyncAction.ASYNC_ACTION_ERROR: {
      const { error } = action
      const id = counter++
      const type = 'error'
      if (error instanceof ApiError) {
        return { ...state, [id]: { id, type, message: error.name, description: error.message } }
      } else {
        return { ...state, [id]: { id, type, message: i18n.ERROR, description: i18n.UNKNOWN_ERROR } }
      }
    }
    case notifications.POP_NOTIFICATION: {
      const { id } = action
      state = { ...state }
      delete state[id]
      return state
    }
    case notifications.PUSH_NOTIFICATION: {
      const id = counter++
      const { data } = action
      return { ...state, [id]: { ...data, id } }
    }
    default:
      return state
  }
}
