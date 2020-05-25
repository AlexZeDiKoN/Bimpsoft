import React from 'react'
import './style.css'
import { components } from '@DZVIN/CommonComponents'
import PropTypes from 'prop-types'
import {
  LayersContainer,
  OrgStructuresContainer,
  MarchContainer,
  CatalogsContainer,
  TargetCatalogContainer,
  SymbolsContainer,
  LogMapContainer,
} from '../../containers'
import { TabsPanel, PrintPanel } from '../../components/common'

const SIDEBAR_PANEL_SIZE_DEFAULT = 400

const { common: { ValueSwiper } } = components
const SIDEBAR_SIZE_DEFAULT = 320
const SIDEBAR_SIZE_MARCH_DEFAULT = 405
const SIDEBAR_SIZE_MIN = 320
const SIDEBAR_CLOSED_SIZE = 40
const SIDEBAR_OPEN_MIN_SIZE = 275

export default class Sidebar extends React.Component {
  static propTypes = {
    isMapCOP: PropTypes.bool,
    is3DMapMode: PropTypes.bool,
    visible: PropTypes.bool,
    printStatus: PropTypes.bool,
    marchEdit: PropTypes.bool,
    setSidebar: PropTypes.func,
    sidebar: PropTypes.bool,
  }

  state = {
    topPanelHeight: SIDEBAR_PANEL_SIZE_DEFAULT,
    sidebarWidth: this.props.marchEdit ? SIDEBAR_SIZE_MARCH_DEFAULT : SIDEBAR_SIZE_DEFAULT,
  }

  changeWidthHandler = (startValue, pos) => {
    const sidebarWidth = Math.max(SIDEBAR_SIZE_MIN, startValue - pos.x)
    this.setState({ sidebarWidth })
  }

  changeSidebarPanels = () => {
    const { printStatus, marchEdit, isMapCOP, is3DMapMode, sidebar, setSidebar } = this.props
    if (printStatus) {
      return <PrintPanel/>
    } else if (marchEdit) {
      return <MarchContainer/>
    } else {
      return (
        <>
          <div
            className="sidebar-panel1"
          >
            <TabsPanel
              setSidebar={setSidebar}
              sidebar={sidebar}
              tabs={[
                LayersContainer,
                OrgStructuresContainer,
                !is3DMapMode && CatalogsContainer,
                isMapCOP ? TargetCatalogContainer : null,
                SymbolsContainer,
                LogMapContainer,
              ].filter(Boolean)}
            />
          </div>
        </>
      )
    }
  }

  render () {
    const { sidebarWidth } = this.state
    const { visible, sidebar, marchEdit } = this.props
    const sidebarDisplay = visible ? '' : 'none'
    return (
      <>
        {sidebar && <ValueSwiper
          style={{ display: sidebarDisplay }}
          value={this.state.sidebarWidth}
          onChange={this.changeWidthHandler}
        />}
        <div
          className="app-sidebar"
          style={{
            minWidth: sidebar ? SIDEBAR_OPEN_MIN_SIZE : SIDEBAR_CLOSED_SIZE,
            width: sidebar || marchEdit ? sidebarWidth : SIDEBAR_CLOSED_SIZE,
            display: sidebarDisplay }}>
          <div className="sidebar">
            {this.changeSidebarPanels()}
          </div>
        </div>
      </>
    )
  }
}
