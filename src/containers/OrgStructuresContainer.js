import { connect } from 'react-redux'
import OrgStructuresComponent from '../components/OrgStructuresComponent'
import * as selectionActions from '../store/actions/selection'
import * as orgStructuresActions from '../store/actions/orgStructures'
import orgStructuresTreeSelector from '../store/orgStructuresTreeSelector'

const mapStateToProps = (store) => {
  const orgStructures = orgStructuresTreeSelector(store)
  const { selectedId } = store.orgStructures
  return { selectedId, orgStructures }
}

const mapDispatchToProps = {

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
