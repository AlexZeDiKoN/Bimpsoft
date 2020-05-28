import { connect } from 'react-redux'
import LogMap from '../components/LogMap'
import { userEvents } from '../store/selectors'

const mapStateToProps = (state) => {
  const user = state.webMap.get('contactFullName')

  return {
    user,
    userEvents: userEvents(state),
  }
}

const LogMapContainer = connect(mapStateToProps)(LogMap)

export default LogMapContainer
