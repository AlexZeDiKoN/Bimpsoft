import { connect } from 'react-redux'
import OrgStructuresComponent from '../components/OrgStructuresComponent'
import SelectionTypes from '../constants/SelectionTypes'
import * as selectionActions from '../store/actions/selection'
import orgStructuresTreeSelector from '../store/orgStructuresTreeSelector'

const mapStateToProps = (store) => orgStructuresTreeSelector(store)

const mapDispatchToProps = {

  onClick: (app6Code, unitID) => (dispatch, getState) => {
    const {
      webMap: { center },
    } = getState()
    dispatch(selectionActions.setNewShape({
      type: SelectionTypes.POINT,
      code: app6Code,
      orgStructureId: unitID,
      coordinatesArray: [ center ],
    }))
    dispatch(selectionActions.showCreateForm)
  },
}

const OrgStructuresContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(OrgStructuresComponent)

export default OrgStructuresContainer
