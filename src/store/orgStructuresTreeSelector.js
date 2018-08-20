import { createSelector } from 'reselect'

const orgStructuresTreeSelector = createSelector(
  (state) => state.orgStructures.unitsById,
  (state) => state.orgStructures.relations,
  (unitsById, relations) => {
    const byIds = {}
    const roots = []
    relations.forEach(({ unitID, parentUnitID }) => {
      const unit = unitsById[unitID]
      if (unit) {
        byIds[unitID] = { ...unitsById[unitID], parentUnitID, children: [] }
      }
    })
    relations.forEach(({ unitID, parentUnitID }) => {
      if (byIds.hasOwnProperty(unitID)) {
        const parent = byIds[parentUnitID]
        if (parent) {
          parent.children.push(unitID)
        } else {
          roots.push(unitID)
        }
      }
    })
    return { byIds, roots }
  }
)
export default orgStructuresTreeSelector
