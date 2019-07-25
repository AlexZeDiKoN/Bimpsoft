import { createSelector } from 'reselect'
import { selectedLayer } from './layersSelector'

const orgStructures = (state) => state.orgStructures.byIds

export const currentOrgStructureId = createSelector(
  selectedLayer,
  (selectedLayer) => selectedLayer && selectedLayer.formationId
)

export const currentOrgStructure = createSelector(
  orgStructures,
  currentOrgStructureId,
  (orgStructures, id) => orgStructures && id && orgStructures[id]
)
