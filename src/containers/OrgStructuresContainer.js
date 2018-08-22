import { connect } from 'react-redux'
import OrgStructuresComponent from '../components/OrgStructuresComponent'
import SelectionTypes from '../constants/SelectionTypes'
import * as selectionActions from '../store/actions/selection'
import orgStructuresTreeSelector from '../store/orgStructuresTreeSelector'

const mapStateToProps = (store) => orgStructuresTreeSelector(store)

const mapDispatchToProps = {

  onClick: (unitID) => (dispatch, getState) => {
    const {
      webMap: { center },
    } = getState()
    dispatch(selectionActions.newShapeFromUnit(unitID, center))
  },
}

const OrgStructuresContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(OrgStructuresComponent)

export default OrgStructuresContainer
