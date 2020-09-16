import { selectedList, selectedPoints, selectedLayerId } from '../selectors'
import { determineGroupType } from '../utils'
import { asyncAction, selection } from './index'

export const createGroup = () =>
  asyncAction.withNotification(async (dispatch, getState, { webmapApi: { groupCreate } }) => {
    const state = getState()
    let list = selectedList(state)
    const layer = selectedLayerId(state)
    const scale = state.webMap.zoom
    const objects = state.webMap.objects
    const type = determineGroupType(selectedPoints(state))
    list = list.filter((id) => objects.get(id).layer === layer)
    if (list.length > 1) {
      const { id } = await groupCreate(type, list, layer, scale)
      return dispatch(selection.selectedList([ id ]))
    }
  })

export const createGroupRegion = () =>
  asyncAction.withNotification(async (dispatch, getState, { webmapApi: { groupCreate } }) => {
    const state = getState()
    let list = selectedList(state)
    const objects = state.webMap.objects
    const layer = selectedLayerId(state)
    const scale = state.webMap.zoom
    list = list.filter((id) => objects.get(id).layer === layer)
    if (list.length > 1) {
      const { id } = await groupCreate('region', list, layer, scale)
      return dispatch(selection.selectedList([ id ]))
    }
  })

export const dropGroup = () =>
  asyncAction.withNotification(async (dispatch, getState, { webmapApi: { groupDrop } }) => {
    const state = getState()
    const group = selectedList(state)[0]
    const layer = selectedLayerId(state)
    const idList = await groupDrop(group, layer)
    return dispatch(selection.selectedList(idList))
  })
