import { Record, List, Map } from 'immutable'
import { actionNames } from '../actions/changeLog'

const MAX_COUNT = 1000

const Change = Record({
  mapId: null,
  layerId: null,
  objectId: null,
  changeType: null,
  changeDate: null,
  userId: null,
  userName: '',
})

export default function changeLogReducer (state = new Map(), action) {
  const { type, payload } = action
  switch (type) {
    case actionNames.LOG_CHANGE: {
      const change = new Change(payload)
      let list = state.get(payload.mapId)
      if (!list) {
        list = List()
      } else if (list.size > MAX_COUNT) {
        list = list.slice(-MAX_COUNT)
      }
      return list.find((item) => (
        item.changeDate === payload.changeDate && item.userId === payload.userId &&
        item.changeType === payload.changeType && item.objectId === payload.objectId
      ))
        ? state
        : state.set(payload.mapId, list.unshift(change))
    }
    default:
      return state
  }
}
