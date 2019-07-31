import { task } from '../actions'

const initState = Object.freeze({
  contacts: null,
  localContacts: null,
  priorities: null,
  value: null,
})

export default function reducer (state = initState, action) {
  const { type, payload } = action
  switch (type) {
    case task.SHOW:
      return state.value ? state : { ...state, value: {} }
    case task.HIDE:
      return initState
    case task.CHANGE_VALUE:
      return { ...state, value: payload }
    case task.SET_ADDITION_DATA: {
      const { contacts, localContacts, priorities } = payload
      return { ...state, contacts, localContacts, priorities }
    }
    default:
      return state
  }
}
