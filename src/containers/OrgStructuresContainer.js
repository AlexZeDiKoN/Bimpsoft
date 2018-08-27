import { connect } from 'react-redux'
import OrgStructuresComponent from '../components/OrgStructuresComponent'
import * as selectionActions from '../store/actions/selection'
import * as orgStructuresActions from '../store/actions/orgStructures'

const mapStateToProps = (store) => {
  const { byIds, roots, formation, selectedId, textFilter, expandedIds } = store.orgStructures
  return { selectedId, textFilter, expandedIds, orgStructures: { byIds, roots, formation } }
}

const mapDispatchToProps = {
  onExpand: (key) => orgStructuresActions.expandOrgStructureItem(key),
  onFilterTextChange: (filterText) => orgStructuresActions.setOrgStructuresFilterText(filterText),
  onClick: (unitID) => orgStructuresActions.setOrgStructureSelectedId(unitID),
  onDoubleClick: (unitID) => (dispatch, getState) => {
    const {
      webMap: { center, objects },
    } = getState()
    const object = objects.find((object) => object.unit === unitID)
    if (!object) {
      dispatch(selectionActions.newShapeFromUnit(unitID, center))
    }
  },
}

const OrgStructuresContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(OrgStructuresComponent)

export default OrgStructuresContainer
