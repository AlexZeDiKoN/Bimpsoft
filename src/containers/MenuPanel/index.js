import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose, pure } from 'recompose'
import { webMap as webMapActions } from '../../store/actions'
import MenuPanelButtons from './MenuPanelButtons'
import './MenuPanel.css'

const MenuPanel = (props) => (
  <div className="menu_panel">
    <MenuPanelButtons {...props}/>
  </div>
)

const mapStateToProps = (store) => {
  const {
    webMap: {
      isMapEditMode,
      isPointMarkEditMode,
      isTextMarkEditMode,
      isTimelineEditMode,
    },
  } = store

  return {
    isMapEditMode,
    isPointMarkEditMode,
    isTextMarkEditMode,
    isTimelineEditMode,
  }
}
const mapDispatchToProps = (dispatch) => ({
  toggleMapEditMode: () => dispatch(webMapActions.toggleMapEditMode()),
  togglePointMarkEditMode: () => dispatch(webMapActions.togglePointMarkEditMode()),
  toggleTextMarkEditMode: () => dispatch(webMapActions.toggleTextMarkEditMode()),
  toggleTimelineEditMode: () => dispatch(webMapActions.toggleTimelineEditMode()),
})
const withStoreConnection = connect(mapStateToProps, mapDispatchToProps)

export default compose(
  pure,
  withStoreConnection,
)(MenuPanel)

export {
  MenuPanel,
}
