import React from 'react'
import { Layout } from 'antd'
import { ApplicationContent, MenuPanel } from './layouts'
import './App.css'

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

  toggleSidebar = () => this.setState({ isSidebarCollapsed: !this.state.isSidebarCollapsed })

  setSidebarWidth = (sidebarWidth) => this.setState({ sidebarWidth })

  sidebarResizeStart = (event) => {
    this._sidebarResizeStartPoint = event.pageX
    // this._prevSidebarWidth = event.pageX
    window.addEventListener('mousemove', this.sidebarResize)
    window.addEventListener('mouseup', () => window.removeEventListener('mousemove', this.sidebarResize))
  }

  sidebarResize = (event) => {
    if (process.env.NODE_ENV === 'development') {
      window.console.log('resize', event, this._sidebarResizeStartPoint - event.pageX)
    }
  }

  render () {
    return (
      <div id="app" className="app">
        <Layout className="app-layout">
          <Layout.Header className="app-header_wrapper">
            <MenuPanel toggleSidebar={this.toggleSidebar}/>
          </Layout.Header>
          <Layout className="app-layout_inner" hasSider={true}>
            <Layout.Content className="app-content_wrapper">
              <ApplicationContent />
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
