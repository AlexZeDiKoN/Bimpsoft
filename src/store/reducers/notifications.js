import { asyncAction, notifications } from '../actions'
import { ApiError } from '../../constants/errors'

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
        return { ...state, [id]: { id, type, message: 'Помилка', description: 'Невідома помилка' } }
      }
    }
    case notifications.POP_NOTIFICATION: {
      const { id } = action
      state = { ...state }
      delete state[id]
      return state
    }
    default:
      return state
  }
}
