import React, {Fragment} from 'react'
import './style.css'
import { components } from '@DZVIN/CommonComponents'
import { panels } from '../../containers'
import { TabsPanel } from '../../components/common'
import PropTypes from "prop-types";
const SIDEBAR_PANEL_SIZE_DEFAULT = 400
const SIDEBAR_PANEL_SIZE_MIN = 100

const { common: { ValueSwiper } } = components
const SIDEBAR_SIZE_DEFAULT = 300
const SIDEBAR_SIZE_MIN = 250

export default class Sidebar extends React.Component {

  static propTypes = {
    visible: PropTypes.bool,
  }

  state = {
    topPanelHeight: SIDEBAR_PANEL_SIZE_DEFAULT,
    sidebarWidth: SIDEBAR_SIZE_DEFAULT,
  }

  changeWidthHandler = (startValue, pos) => {
    const sidebarWidth = Math.max(SIDEBAR_SIZE_MIN, startValue - pos.x)
    this.setState({ sidebarWidth })
  }

  render () {
    const { visible } = this.props
    const sidebarDisplay = visible ? '' : 'none'
    return (
      <Fragment>
        <ValueSwiper
          style={{ display: sidebarDisplay }}
          value={this.state.sidebarWidth}
          onChange={this.changeWidthHandler}
        />
        <div className="app-sidebar" style={{ width: this.state.sidebarWidth, display: sidebarDisplay }}>
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
        </div>
      </Fragment>
    )
  }
}

Sidebar.propTypes = {

}
