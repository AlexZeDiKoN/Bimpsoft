import React, { Fragment } from 'react'
import './style.css'
import { components } from '@DZVIN/CommonComponents'
import PropTypes from 'prop-types'
import { LayersContainer, OrgStructuresContainer } from '../../containers'
import { TabsPanel, PrintPanel } from '../../components/common'
const SIDEBAR_PANEL_SIZE_DEFAULT = 400
const SIDEBAR_PANEL_SIZE_MIN = 100

const { common: { ValueSwiper } } = components
const SIDEBAR_SIZE_DEFAULT = 300
const SIDEBAR_SIZE_MIN = 250

export default class Sidebar extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    printStatus: PropTypes.bool,
  }

  state = {
    topPanelHeight: SIDEBAR_PANEL_SIZE_DEFAULT,
    sidebarWidth: SIDEBAR_SIZE_DEFAULT,
  }

  changeWidthHandler = (startValue, pos) => {
    const sidebarWidth = Math.max(SIDEBAR_SIZE_MIN, startValue - pos.x)
    this.setState({ sidebarWidth })
  }

  changeSidebarPanels = (preparationForPrinting) => {
    if (preparationForPrinting) {
      return <PrintPanel />
    } else {
      return (
        <Fragment>
          <div className="sidebar-panel1" style={{ height: this.state.topPanelHeight }}>
            <TabsPanel tabs={[ OrgStructuresContainer ]} />
          </div>
          <ValueSwiper
            value={this.state.topPanelHeight}
            onChange={(startValue, pos) => {
              this.setState({ topPanelHeight: Math.max(SIDEBAR_PANEL_SIZE_MIN, startValue + pos.y) })
            }}
          />
          <div className="sidebar-panel2">
            <TabsPanel tabs={[ LayersContainer ]} />
          </div>
        </Fragment>
      )
    }
  }

  render () {
    const { visible, printStatus } = this.props
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
            {this.changeSidebarPanels(printStatus)}
          </div>
        </div>
      </Fragment>
    )
  }
}
