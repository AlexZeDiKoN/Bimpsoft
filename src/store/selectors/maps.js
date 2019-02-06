import { createSelector } from 'reselect'
import { activeMapSelector } from './layersSelector'

const calc = (state) => state.maps.calc

export const inICTMode = createSelector(
  activeMapSelector,
  calc,
  (activeMapId, calc) => activeMapId && calc && calc[activeMapId]
)
