import { connect } from 'react-redux'
import LogMap from '../components/LogMap'
import { userEvents } from '../store/selectors'
import { webMap } from '../store/actions'

const mapStateToProps = (state) => {
  const user = state.webMap.get('contactFullName')

  return {
    user,
    userEvents: userEvents(state),
  }
}

const mapDispatchToProps = {
  highlightObject: webMap.highlightObject,
}

const LogMapContainer = connect(mapStateToProps, mapDispatchToProps)(LogMap)

export default LogMapContainer
