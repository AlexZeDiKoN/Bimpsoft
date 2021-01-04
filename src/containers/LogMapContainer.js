import { connect } from 'react-redux'
import { message } from 'antd'
import LogMap from '../components/LogMap'
import { activeMapChangeLog } from '../store/selectors'
import { webMap, selection } from '../store/actions'
import { changeTypes } from '../store/actions/webMap'
import i18n from '../i18n'

const changedDescriptions = {
  [changeTypes.DELETE_OBJECT]: i18n.DELETE_OBJECT_MSG,
  [changeTypes.DELETE_LIST]: i18n.DELETE_LIST_MSG,
}

const mapStateToProps = (state) => ({
  changeLog: activeMapChangeLog(state),
})

const mapDispatchToProps = {
  highlightObject: webMap.highlightObject,
  clickObject: (id) => selection.selectedList(Array.isArray(id) ? id : [ id ]),
  doubleClickObject: (id) => (dispatch, getState) => {
    const changedList = activeMapChangeLog(getState())
    const selectedElement = changedList.find(({ objectId }) => objectId === id)
    const messageText = changedDescriptions?.[selectedElement?.changeType]
    if (messageText) {
      message.error(messageText, 3)
      return
    }
    const list = Array.isArray(id) ? id : [ id ]
    dispatch(selection.selectedList(list))
    window.webMap.zoomToSelection()
  },
}

const LogMapContainer = connect(mapStateToProps, mapDispatchToProps)(LogMap)

export default LogMapContainer
