import { asyncAction } from './index'

export const createGroup = (type, objects, layer, scale) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { groupCreate } }) => {
    //
    return groupCreate(type, objects, layer, scale)
  })

export const dropGroup = (group, layer) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { groupDrop } }) => {
    //
    return groupDrop(group, layer)
  })
