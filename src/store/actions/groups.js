import { selectedList, selectedPoints, selectedLayerId } from '../selectors'
import { determineGroupType } from '../utils'
import { asyncAction, selection } from './index'
import { actionNames, changeTypes } from './webMap'

export const createGroup = (addUndoRecord = true) =>
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

      if (addUndoRecord) {
        dispatch({
          type: actionNames.ADD_UNDO_RECORD,
          payload: {
            changeType: changeTypes.CREATE_GROUP,
            layer,
            id,
            list,
          },
        })
      }

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

export const dropGroup = (addUndoRecord = true) =>
  asyncAction.withNotification(async (dispatch, getState, { webmapApi: { groupDrop } }) => {
    const state = getState()
    const group = selectedList(state)[0]
    const layer = selectedLayerId(state)
    const idList = await groupDrop(group, layer)

    if (addUndoRecord) {
      dispatch({
        type: actionNames.ADD_UNDO_RECORD,
        payload: {
          changeType: changeTypes.DROP_GROUP,
          layer,
          id: group,
          list: idList,
        },
      })
    }

    return dispatch(selection.selectedList(idList))
  })
