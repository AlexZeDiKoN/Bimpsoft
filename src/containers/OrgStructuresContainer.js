import { connect } from 'react-redux'
import { batchActions } from 'redux-batched-actions'
import OrgStructuresComponent from '../components/OrgStructuresComponent'
import { selection, orgStructures, webMap } from '../store/actions'
import { canEditSelector } from '../store/selectors'

const mapStateToProps = (store) => {
  const { orgStructures } = store
  const canEdit = canEditSelector(store)
  const { byIds, roots, formation, selectedId, textFilter, expandedIds } = orgStructures
  return { canEdit, selectedId, textFilter, expandedIds, orgStructures: { byIds, roots, formation } }
}

const mapDispatchToProps = {
  onExpand: (key) => orgStructures.expandOrgStructureItem(key),
  onFilterTextChange: (filterText) => orgStructures.setOrgStructuresFilterText(filterText),
  onClick: (unitID) => orgStructures.setOrgStructureSelectedId(unitID),
  onDoubleClick: (unitID) => (dispatch, getState) => {
    const state = getState()
    const {
      webMap: { center, objects },
    } = state
    const canEdit = canEditSelector(state)
    const unitObjects = objects.filter((object) => object.unit === unitID)
    if (unitObjects.size) {
      dispatch(batchActions([
        selection.selectedList([ ...unitObjects.keys() ]),
        webMap.setScaleToSelection(true),
      ]))
    } else if (canEdit) {
      dispatch(selection.newShapeFromUnit(unitID, center))
    }
  },
}

const OrgStructuresContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(OrgStructuresComponent)

export default OrgStructuresContainer
