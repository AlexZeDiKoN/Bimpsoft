import { connect } from 'react-redux'
import LogMap from '../components/LogMap'
import { activeMapChangeLog } from '../store/selectors'
import { webMap, selection } from '../store/actions'

const mapStateToProps = (state) => ({
  changeLog: activeMapChangeLog(state),
})

const mapDispatchToProps = {
  highlightObject: webMap.highlightObject,
  clickObject: (id) => selection.selectedList(Array.isArray(id) ? id : [ id ]),
  doubleClickObject: (id) => (dispatch) => {
    const list = Array.isArray(id) ? id : [ id ]
    dispatch(selection.selectedList(list))
    window.webMap.zoomToSelection()
  }
}

const LogMapContainer = connect(mapStateToProps, mapDispatchToProps)(LogMap)

export default LogMapContainer
