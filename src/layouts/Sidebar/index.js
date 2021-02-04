import React from 'react'
import './style.css'
import { components, IconNames } from '@C4/CommonComponents'
import PropTypes from 'prop-types'
import {
  LayersContainer,
  OrgStructuresContainer,
  MarchContainer,
  CatalogsContainer,
  TargetCatalogContainer,
  SymbolsContainer,
  LogMapContainer,
  FilterContainer,
  FilterTopographicObjects,
} from '../../containers'
import { TabsPanel, PrintPanel } from '../../components/common'
import i18n from '../../i18n'

const SIDEBAR_PANEL_SIZE_DEFAULT = 400

const { common: { ValueSwiper } } = components
export const SIDEBAR_SIZE_DEFAULT = 320
const SIDEBAR_SIZE_MARCH_DEFAULT = 405
const SIDEBAR_SIZE_MIN = 320
const SIDEBAR_CLOSED_SIZE = 40
const SIDEBAR_OPEN_MIN_SIZE = 275

export default class Sidebar extends React.Component {
  static propTypes = {
    isMapCOP: PropTypes.bool,
    isHaveActiveLayer: PropTypes.bool,
    is3DMapMode: PropTypes.bool,
    visible: PropTypes.bool,
    printStatus: PropTypes.bool,
    marchEdit: PropTypes.bool,
    setSidebarTabIndex: PropTypes.func,
    sidebarSelectedTabIndex: PropTypes.number,
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
    const { printStatus, marchEdit, isMapCOP, is3DMapMode, isHaveActiveLayer } = this.props
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
                {
                  Component: LayersContainer,
                  title: i18n.LAYERS,
                  icon: IconNames.LAYERS,
                  enabled: true,
                },
                {
                  Component: OrgStructuresContainer,
                  title: i18n.ORG_STRUCTURE_SHORT,
                  icon: IconNames.ORG_STRUCTURE,
                  enabled: true,
                },
                {
                  Component: CatalogsContainer,
                  title: i18n.CATALOGS,
                  icon: IconNames.CATALOG,
                  enabled: !is3DMapMode,
                },
                {
                  Component: TargetCatalogContainer,
                  title: i18n.TARGETS,
                  icon: IconNames.TARGETS,
                  enabled: isMapCOP,
                },
                {
                  Component: SymbolsContainer,
                  title: i18n.SYMBOLS,
                  icon: IconNames.SYMBOLS,
                  enabled: true,
                },
                {
                  Component: LogMapContainer,
                  title: i18n.LOG_MAP,
                  icon: IconNames.LOG_EVENT,
                  enabled: true,
                },
                {
                  Component: FilterContainer,
                  title: i18n.STRAINERS,
                  icon: IconNames.FILTER,
                  enabled: isHaveActiveLayer,
                },
                {
                  Component: FilterTopographicObjects,
                  title: i18n.TOPOGRAPHIC_OBJECTS,
                  icon: IconNames.MAP_HEADER_ICON_MENU_TOPOGRAPHY_1,
                  enabled: true,
                },
              ].filter(Boolean)}
              onToggle={this.onToggle}
            />
          </div>
        </>
      )
    }
  }

  onToggle = (selectedTabIndex) => {
    const { setSidebarTabIndex } = this.props
    setSidebarTabIndex(selectedTabIndex)
  }

  render () {
    const { sidebarWidth } = this.state
    const { marchEdit, sidebarSelectedTabIndex } = this.props
    const sidebarDisplay = sidebarSelectedTabIndex >= 0
    return (
      <>
        {sidebarDisplay && <ValueSwiper
          value={this.state.sidebarWidth}
          onChange={this.changeWidthHandler}
        />}
        <div
          className="app-sidebar"
          style={{
            minWidth: sidebarDisplay ? SIDEBAR_OPEN_MIN_SIZE : SIDEBAR_CLOSED_SIZE,
            width: sidebarDisplay || marchEdit ? sidebarWidth : SIDEBAR_CLOSED_SIZE,
          }}>
          <div className="sidebar">
            {this.changeSidebarPanels()}
          </div>
        </div>
      </>
    )
  }
}
