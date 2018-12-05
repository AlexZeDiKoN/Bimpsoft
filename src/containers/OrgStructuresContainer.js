import { connect } from 'react-redux'
import OrgStructuresComponent from '../components/OrgStructuresComponent'
import * as selectionActions from '../store/actions/selection'
import * as orgStructuresActions from '../store/actions/orgStructures'
import { canEditSelector } from '../store/selectors'

const mapStateToProps = (store) => {
  const { orgStructures } = store
  const canEdit = canEditSelector(store)
  const { byIds, roots, formation, selectedId, textFilter, expandedIds } = orgStructures
  return { canEdit, selectedId, textFilter, expandedIds, orgStructures: { byIds, roots, formation } }
}

const mapDispatchToProps = {
  onExpand: (key) => orgStructuresActions.expandOrgStructureItem(key),
  onFilterTextChange: (filterText) => orgStructuresActions.setOrgStructuresFilterText(filterText),
  onClick: (unitID) => orgStructuresActions.setOrgStructureSelectedId(unitID),
  onDoubleClick: (unitID) => (dispatch, getState) => {
    const state = getState()
    const {
      webMap: { center, objects },
    } = state
    const canEdit = canEditSelector(state)
    const unitObjects = objects.filter((object) => object.unit === unitID)
    if (unitObjects.size) {
      dispatch(selectionActions.selectedList([ ...unitObjects.keys() ]))
    } else if (canEdit) {
      dispatch(selectionActions.newShapeFromUnit(unitID, center))
    }
  },
}

const OrgStructuresContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(OrgStructuresComponent)

export default OrgStructuresContainer
