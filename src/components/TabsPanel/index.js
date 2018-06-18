import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import './style.css'

export default class TabsPanel extends React.Component {
  state = {
    selectedTab: null,
  }

  render () {
    let { selectedTab } = this.state
    if (this.props.tabs.length > 0 && this.props.tabs.indexOf(this.state.selectedTab) === -1) {
      selectedTab = this.props.tabs[0]
    }

    return (
      <div className="tabs-panel">
        <div className="tabs-panel-headers">
          {this.props.tabs.map((tab) => {
            const { title } = this.props.panels[tab]
            const isSelected = selectedTab === tab
            return (
              <div
                key={tab}
                className={'tabs-panel-header ' + (isSelected ? 'tabs-panel-header-selected' : '')}
                onClick={() => this.setState({ selectedTab: tab })}
              >
                {title}
              </div>
            )
          })}
        </div>
        <div className="tabs-panel-content">
          {this.props.tabs.map((tab) => {
            const { component } = this.props.panels[tab]
            const isSelected = selectedTab === tab
            return isSelected && (
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
