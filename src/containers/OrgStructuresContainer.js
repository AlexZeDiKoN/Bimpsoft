import { connect } from 'react-redux'
import OrgStructuresComponent from '../components/OrgStructuresComponent'

const mapStateToProps = (store) => {
  const { orgStructures } = store

  return { orgStructures }
}
const mapDispatchToProps = (dispatch) => ({

})

const OrgStructuresContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(OrgStructuresComponent)

export default OrgStructuresContainer
