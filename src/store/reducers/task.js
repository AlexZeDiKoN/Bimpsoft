import { task } from '../actions'

const initState = Object.freeze({
  friendObjectId: null,
  modalData: null,
  context: null,
})

export default function reducer (state = initState, action) {
  const { type, payload } = action
  switch (type) {
    case task.SET_FRIEND_ID:
      return { ...state, friendObjectId: payload }
    case task.SET_TASK_MODAL_DATA: {
      return { ...state, modalData: payload.modalData, context: payload.context }
    }
    case task.SET_TASK_VALUE: {
      const result = {
        ...state,
        modalData: {
          ...state.modalData,
          value: { ...(state.modalData && state.modalData.value), ...payload },
        },
      }
      return result
    }
    case task.SET_TASK_CONTEXT_VALUE: {
      return { ...state, context: { ...(state.context || {}), ...payload } }
    }
    default:
      return state
  }
}
