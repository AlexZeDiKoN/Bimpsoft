import React from 'react'
// import PropTypes from 'prop-types'
import {
  // Redirect,
  Route,
  Switch,
} from 'react-router-dom'
import { Layout, Input } from 'antd'
import { MainMenuLeftContainer, MainMenuRightContainer } from '../../containers'
import { ApplicationContent } from '../../layouts'
import './Main.css'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

const SIDEBAR_SIZE_DEFAULT = 300

class App extends React.Component {
  state = {
    isSidebarCollapsed: true,
    sidebarWidth: SIDEBAR_SIZE_DEFAULT,
  }

  componentDidMount () {
    this.toggleSidebar()
    window.addEventListener('resize', this.resetSidebarWidth)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resetSidebarWidth)
    window.removeEventListener('mousemove', this.sidebarResize)
  }

  routes = [
    {
      link: '/',
      Component: (routerProps) => <ApplicationContent {...this.props} {...routerProps}/>,
    },
  ]

  // Use of iteration index as value for react's 'key' prop isn't a good idea,
  // but in case with static array it's not so bad
  renderRoute = ({ link, Component }, index) => <Route exact path={link} render={Component} key={index}/>

  toggleSidebar = () => this.setState({ isSidebarCollapsed: !this.state.isSidebarCollapsed })

  setSidebarWidth = (sidebarWidth) => this.setState({ sidebarWidth })

  resetSidebarWidth = (sidebarWidth) => this.setState({ sidebarWidth: SIDEBAR_SIZE_DEFAULT })

  sidebarResizeStart = (event) => {
    // Stores the values directly in the component instance (not in state) to prevent unnecessary component update
    this._sidebarResizeStartPoint = event.pageX
    this._prevSidebarWidth = this.state.sidebarWidth
    window.addEventListener('mousemove', this.sidebarResize)
    window.addEventListener('mouseup', () => window.removeEventListener('mousemove', this.sidebarResize))
  }

  sidebarResize = (event) => {
    const SIDEBAR_SIZE_MIN = 300
    const SIDEBAR_SIZE_MAX = window.innerWidth - SIDEBAR_SIZE_MIN
    const calculatedSidebarWidth = this._prevSidebarWidth + this._sidebarResizeStartPoint - event.pageX
    if (calculatedSidebarWidth < SIDEBAR_SIZE_MIN) {
      this.setSidebarWidth(SIDEBAR_SIZE_MIN)
    } else if (calculatedSidebarWidth > SIDEBAR_SIZE_MAX) {
      this.setSidebarWidth(SIDEBAR_SIZE_MAX)
    } else {
      this.setSidebarWidth(calculatedSidebarWidth)
    }
  }

  render () {
    return (
      <div id="app" className="app">
        <Layout className="app-layout">
          <Layout className="header">
            <Layout className="header-left">
              <MainMenuLeftContainer/>
            </Layout>
            <Layout className="header-right">
              <Input.Search placeholder="Пошук" style={{ width: 200 }}/>
              <MainMenuRightContainer/>
            </Layout>
          </Layout>
          <Layout className="app-layout_inner" hasSider={true}>
            <Layout.Content className="app-content_wrapper">
              <Switch>
                {this.routes.map(this.renderRoute)}
              </Switch>
            </Layout.Content>
            {this.props.viewModes.rightPanel && (
              <Layout.Sider
                className="app-sidebar_wrapper"
                trigger={null}
                width={this.state.sidebarWidth}
                collapsedWidth={0}
                collapsible
                collapsed={this.state.isSidebarCollapsed}>

                  TODO Sidebar

                <div className="app-sidebar_resizer" onMouseDown={this.sidebarResizeStart}/>
              </Layout.Sider>
            )}
          </Layout>
        </Layout>
      </div>
    )
  }
}

App.propTypes = {
  viewModes: PropTypes.array.isRequired,
}

const mapStateToProps = (state) => {
  const { viewModes } = state
  return { viewModes }
}
const withStoreConnection = connect(mapStateToProps)
export default withStoreConnection(App)
