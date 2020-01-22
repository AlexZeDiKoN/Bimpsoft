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
} from '../../containers'
import { TabsPanel, PrintPanel } from '../../components/common'

const SIDEBAR_PANEL_SIZE_DEFAULT = 400
const SIDEBAR_PANEL_SIZE_MIN = 210
const SIDEBAR_PANEL_SIZE_MAX = 480

const { common: { ValueSwiper } } = components
const SIDEBAR_SIZE_DEFAULT = 300
const SIDEBAR_SIZE_MARCH_DEFAULT = 450
const SIDEBAR_SIZE_MIN = 250

export default class Sidebar extends React.Component {
  static propTypes = {
    isMapCOP: PropTypes.bool,
    is3DMapMode: PropTypes.bool,
    visible: PropTypes.bool,
    printStatus: PropTypes.bool,
    marchEdit: PropTypes.bool,
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
    const { printStatus, marchEdit, isMapCOP, is3DMapMode } = this.props
    const { topPanelHeight } = this.state
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
              tabs={[
                OrgStructuresContainer,
                !is3DMapMode && CatalogsContainer,
                isMapCOP ? TargetCatalogContainer : null,
                LayersContainer,
              ].filter(Boolean)}
            />
          </div>
          {/*<ValueSwiper*/}
          {/*  value={this.state.topPanelHeight}*/}
          {/*  onChange={(startValue, pos) => {*/}
          {/*    this.setState({ topPanelHeight: Math.max(SIDEBAR_PANEL_SIZE_MIN, startValue + pos.y) })*/}
          {/*  }}*/}
          {/*/>*/}
          {/*<div className="sidebar-panel2">*/}
          {/*  <TabsPanel*/}
          {/*    tabs={[*/}
          {/*      LayersContainer,*/}
          {/*    ]}*/}
          {/*  />*/}
          {/*</div>*/}
        </>
      )
    }
  }

  render () {
    const { visible } = this.props
    const sidebarDisplay = visible ? '' : 'none'
    return (
      <>
        <ValueSwiper
          style={{ display: sidebarDisplay }}
          value={this.state.sidebarWidth}
          onChange={this.changeWidthHandler}
        />
        <div className="app-sidebar" style={{ width: this.state.sidebarWidth, display: sidebarDisplay }}>
          <div className="sidebar">
            {this.changeSidebarPanels()}
          </div>
        </div>
      </>
    )
  }
}
