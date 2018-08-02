import React from 'react'
import {
  Route,
  Switch,
} from 'react-router-dom'
import { components } from '@DZVIN/CommonComponents'
import {
  LeftMenuContainer,
  RightMenuContainer,
  SelectionFormContainer,
  TemplateFormContainer,
  TemplatesListContainer,
  SettingsFormContainer,
} from '../../containers'
import { ApplicationContent } from '../../layouts'
import './Main.css'
import SidebarContainer from '../../containers/SidebarContainer'

const { common: { MovablePanel } } = components

export default class Main extends React.Component {
  routes = [
    {
      link: '/',
      Component: (routerProps) => <ApplicationContent {...this.props} {...routerProps} />,
    },
  ]

  // Use of iteration index as value for react's 'key' prop isn't a good idea,
  // but in case with static array it's not so bad
  renderRoute = ({ link, Component }, index) => <Route exact path={link} render={Component} key={index}/>

  render () {
    return (
      <div id="app" className="app">
        <div className="header">
          <div className="header-top">
            <div className="header-left">
              <LeftMenuContainer/>
            </div>
            <div className="header-right">
              <RightMenuContainer/>
            </div>
          </div>
          <div className="header-bottom">
            <TemplatesListContainer/>
          </div>
        </div>
        <div className="app-body">
          <SelectionFormContainer wrapper={ MovablePanel }/>
          <TemplateFormContainer wrapper={ MovablePanel }/>
          <SettingsFormContainer wrapper={ MovablePanel }/>
          <div className="app-content">
            <Switch>
              {this.routes.map(this.renderRoute)}
            </Switch>
          </div>
          <SidebarContainer />
        </div>
      </div>
    )
  }
}
