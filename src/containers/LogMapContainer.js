import { connect } from 'react-redux'
import LogMap from '../components/LogMap'
import { canEditSelector } from '../store/selectors'

const mapStateToProps = (state) => ({
  canEdit: canEditSelector(state),
})

const LogMapContainer = connect(
  mapStateToProps,
)(LogMap)

export default LogMapContainer
