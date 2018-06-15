import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import './style.css'

export default class TabsPanel extends React.Component {
  render () {
    return (
      <div className="tabs-panel">
        <div className="tabs-panel-headers">
          {this.props.tabs.map((tab) => {
            const { title } = this.props.panels[tab]
            return (
              <div key={tab} className="tabs-panel-header">{title}</div>
            )
          })}
        </div>
        <div className="tabs-panel-content">
          {this.props.tabs.map((tab) => {
            const { component } = this.props.panels[tab]
            return (
              <Fragment key={tab}>{component}</Fragment>
            )
          })}
        </div>
      </div>
    )
  }
}

TabsPanel.propTypes = {
  panels: PropTypes.object,
  tabs: PropTypes.array,
}
