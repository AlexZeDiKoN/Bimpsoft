import React from 'react'
// import PropTypes from 'prop-types'
import {
  // Redirect,
  Route,
  Switch,
} from 'react-router-dom'
import { Layout } from 'antd'
import { MenuPanel } from '../../containers'
import { ApplicationContent } from '../../layouts'
import { warn } from '../../utils/devLoggers'
import './Main.css'

class App extends React.Component {
  state = {
    isSidebarCollapsed: true,
    sidebarWidth: 300,
  }

  componentDidMount () {
    this.toggleSidebar()
  }

  componentWillUnmount () {
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

  sidebarResizeStart = (event) => {
    // Stores the values directly in the component instance (not in state) to prevent unnecessary component update
    this._sidebarResizeStartPoint = event.pageX
    // this._prevSidebarWidth = event.pageX
    window.addEventListener('mousemove', this.sidebarResize)
    window.addEventListener('mouseup', () => window.removeEventListener('mousemove', this.sidebarResize))
  }

  sidebarResize = (event) => {
    warn('resize', event, this._sidebarResizeStartPoint - event.pageX)
  }

  render () {
    return (
      <div id="app" className="app">
        <Layout className="app-layout">
          <Layout.Header className="app-header_wrapper">
            <MenuPanel isSidebarCollapsed={this.state.isSidebarCollapsed} toggleSidebar={this.toggleSidebar}/>
          </Layout.Header>
          <Layout className="app-layout_inner" hasSider={true}>
            <Layout.Content className="app-content_wrapper">
              <Switch>
                {this.routes.map(this.renderRoute)}
              </Switch>
            </Layout.Content>
            <Layout.Sider
              className="app-sidebar_wrapper"
              trigger={null}
              width={this.state.sidebarWidth}
              collapsedWidth={0}
              collapsible
              collapsed={this.state.isSidebarCollapsed}>
              qwe
              <div className="app-sidebar_resizer" onMouseDown={this.sidebarResizeStart}/>
            </Layout.Sider>
          </Layout>
        </Layout>
      </div>
    )
  }
}

export default App
export {
  App,
}
