import React from 'react'
import {
  Route,
  Switch,
} from 'react-router-dom'
import { Input } from 'antd'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import {
  MainMenuLeftContainer,
  MainMenuRightContainer,
  SelectionFormContainer,
  TemplateFormContainer,
} from '../../containers'
import { ApplicationContent } from '../../layouts'
import './Main.css'
import Sidebar from '../Sidebar'
import i18n from '../../i18n'

const { common: { MovablePanel, ValueSwiper } } = components

const SIDEBAR_SIZE_DEFAULT = 300
const SIDEBAR_SIZE_MIN = 250

class App extends React.Component {
  state = {
    sidebarWidth: SIDEBAR_SIZE_DEFAULT,
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

  render () {
    const sidebarDisplay = this.props.viewModes.rightPanel ? '' : 'none'
    return (
      <div id="app" className="app">
        <div className="header">
          <div className="header-left">
            <MainMenuLeftContainer/>
          </div>
          <div className="header-right">
            <Input.Search placeholder={ i18n.SEARCH } style={{ width: 200 }}/>
            <MainMenuRightContainer/>
          </div>
        </div>
        <div className="app-body">
          <SelectionFormContainer wrapper={ MovablePanel }/>
          <TemplateFormContainer wrapper={ MovablePanel }/>
          <div className="app-content">
            <Switch>
              {this.routes.map(this.renderRoute)}
            </Switch>
          </div>
          <ValueSwiper
            style={{ display: sidebarDisplay }}
            value={this.state.sidebarWidth}
            onChange={(startValue, pos) => {
              const sidebarWidth = Math.max(SIDEBAR_SIZE_MIN, startValue - pos.x)
              this.setState({ sidebarWidth })
            }}
          />
          <div className="app-sidebar" style={{ width: this.state.sidebarWidth, display: sidebarDisplay }}>
            <Sidebar />
          </div>
        </div>
      </div>
    )
  }
}

App.propTypes = {
  viewModes: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => {
  const { viewModes } = state
  return { viewModes }
}

export default connect(mapStateToProps)(App)
