import { selectedList, selectedPoints, selectedLayerId } from '../selectors'
import { determineGroupType } from '../utils'
import { asyncAction, selection } from './index'

export const createGroup = () =>
  asyncAction.withNotification(async (dispatch, getState, { webmapApi: { groupCreate } }) => {
    const state = getState()
    const objects = selectedList(state)
    const layer = selectedLayerId(state)
    const scale = state.webMap.zoom
    const type = determineGroupType(selectedPoints(state))
    const { id } = await groupCreate(type, objects, layer, scale)
    return dispatch(selection.selectedList([ id ]))
  })

export const createGroupRegion = () =>
  asyncAction.withNotification(async (dispatch, getState, { webmapApi: { groupCreate } }) => {
    const state = getState()
    const objects = selectedList(state)
    const layer = selectedLayerId(state)
    const scale = state.webMap.zoom
    return groupCreate('region', objects, layer, scale)
  })

export const dropGroup = () =>
  asyncAction.withNotification(async (dispatch, getState, { webmapApi: { groupDrop } }) => {
    const state = getState()
    const group = selectedList(state)[0]
    const layer = selectedLayerId(state)
    const idList = await groupDrop(group, layer)
    return dispatch(selection.selectedList(idList))
  })
