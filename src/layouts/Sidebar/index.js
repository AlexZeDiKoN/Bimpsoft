import React from 'react'
import './style.css'
import { components } from '@DZVIN/CommonComponents'
import { panels } from '../../containers'
import { TabsPanel } from '../../components/common'
const SIDEBAR_PANEL_SIZE_DEFAULT = 400
const SIDEBAR_PANEL_SIZE_MIN = 100

const { common: { ValueSwiper } } = components

export default class Sidebar extends React.Component {
  state = {
    topPanelHeight: SIDEBAR_PANEL_SIZE_DEFAULT,
  }

  render () {
    return (
      <div className="sidebar">
        <div className="sidebar-panel1" style={{ height: this.state.topPanelHeight }}>
          <TabsPanel tabs={[ 'structure', 'history' ]} panels={panels} />
        </div>
        <ValueSwiper
          value={this.state.topPanelHeight}
          onChange={(startValue, pos) => {
            this.setState({ topPanelHeight: Math.max(SIDEBAR_PANEL_SIZE_MIN, startValue + pos.y) })
          }}
        />
        <div className="sidebar-panel2">
          <TabsPanel tabs={[ 'layers' ]} panels={panels} />
        </div>
      </div>
    )
  }
}

Sidebar.propTypes = {

}
