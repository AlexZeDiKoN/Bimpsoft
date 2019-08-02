import { asyncAction } from './index'

export const getZones = (objects, enemy) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { buildZone } }) => buildZone(objects, enemy))
