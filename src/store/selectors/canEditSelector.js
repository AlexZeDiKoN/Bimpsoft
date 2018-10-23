import { createSelector } from 'reselect'

export const canEditSelector = createSelector(
  (state) => state.layers,
  ({ editMode, byId, selectedId }) => Boolean(editMode && byId.hasOwnProperty(selectedId) && !byId[selectedId].readOnly)
)
