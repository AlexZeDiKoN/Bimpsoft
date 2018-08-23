import { connect } from 'react-redux'
import OrgStructuresComponent from '../components/OrgStructuresComponent'
import * as selectionActions from '../store/actions/selection'
import orgStructuresTreeSelector from '../store/orgStructuresTreeSelector'
import { mapObjConvertor } from '../utils'

const mapStateToProps = (store) => {
  const orgStructures = orgStructuresTreeSelector(store)
  const selectionData = store.selection.data
  const selectedOrgStructureId = selectionData ? +selectionData.orgStructureId : null
  return { selectedOrgStructureId, orgStructures }
}

const mapDispatchToProps = {

  onClick: (unitID) => (dispatch, getState) => {
    const {
      webMap: { center, objects },
    } = getState()
    const object = objects.find((object) => +object.unit === unitID)
    if (object) {
      dispatch(selectionActions.setSelection(mapObjConvertor.toSelection(object), center))
    }
  },
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
