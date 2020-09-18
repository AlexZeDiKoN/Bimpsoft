import { createSelector } from 'reselect'
import { mapId } from './layersSelector'

const changeLog = ({ changeLog }) => changeLog

export const activeMapChangeLog = createSelector(
  changeLog,
  mapId,
  (maps, mapId) => maps.get(mapId)
)
