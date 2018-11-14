import { createSelector } from 'reselect'
import { date } from '../../utils'

export const canEditSelector = createSelector(
  (state) => state.layers,
  ({ editMode, byId, selectedId, timelineFrom, timelineTo }) => {
    if (!editMode || !byId.hasOwnProperty(selectedId)) {
      return false
    }
    const { readOnly, visible, dateFor } = byId[selectedId]
    return !readOnly && visible && date.inDateRange(dateFor, timelineFrom, timelineTo)
  }
)

export const visibleLayersSelector = createSelector(
  (state) => state.layers.byId,
  (state) => state.layers.timelineFrom,
  (state) => state.layers.timelineTo,
  (byId, timelineFrom, timelineTo) => {
    const result = {}
    for (const layer of Object.values(byId)) {
      const { layerId, visible, dateFor } = layer
      if (visible && date.inDateRange(dateFor, timelineFrom, timelineTo)) {
        result[layerId] = layer
      }
    }
    return result
  }
)
