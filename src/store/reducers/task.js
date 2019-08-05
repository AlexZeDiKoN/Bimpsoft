import { task } from '../actions'

const initState = Object.freeze({
  enemyObjectId: null,
  friendObjectId: null,
  modalData: null,
})

export default function reducer (state = initState, action) {
  const { type, payload } = action
  switch (type) {
    case task.SET_ENEMY_ID:
      return { ...state, enemyObjectId: payload }
    case task.SET_FRIEND_ID:
      return { ...state, friendObjectId: payload }
    case task.SET_TASK_MODAL_DATA: {
      return { ...state, modalData: payload }
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
    default:
      return state
  }
}
