import { task } from '../actions'

const initState = Object.freeze({
  contacts: null,
  contactsLocal: null,
  priorities: null,
  enemyObjectId: null,
  friendObjectId: null,
  value: null,
})

export default function reducer (state = initState, action) {
  const { type, payload } = action
  switch (type) {
    case task.CHANGE_VALUE:
      return { ...state, value: payload }
    case task.SET_ENEMY_ID:
      return { ...state, enemyObjectId: payload }
    case task.SET_FRIEND_ID:
      return { ...state, friendObjectId: payload }
    case task.SET_ADDITION_DATA: {
      const { contacts, contactsLocal, priorities } = payload
      return { ...state, contacts, contactsLocal, priorities }
    }
    default:
      return state
  }
}
