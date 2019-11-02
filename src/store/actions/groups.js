import { selectedList, selectedPoints, selectedLayerId } from '../selectors'
import { determineGroupType } from '../utils'
import { asyncAction } from './index'

export const createGroup = () =>
  asyncAction.withNotification(async (dispatch, getState, { webmapApi: { groupCreate } }) => {
    const state = getState()
    const objects = selectedList(state)
    const layer = selectedLayerId(state)
    const scale = state.webMap.zoom
    const type = determineGroupType(selectedPoints(state))
    return groupCreate(type, objects, layer, scale)
  })

export const dropGroup = () =>
  asyncAction.withNotification(async (dispatch, getState, { webmapApi: { groupDrop } }) => {
    const state = getState()
    const group = selectedList(state)[0]
    const layer = selectedLayerId(state)
    return groupDrop(group, layer)
  })
