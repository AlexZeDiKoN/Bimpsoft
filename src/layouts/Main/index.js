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
              <Route exact path='/' component={ApplicationContent}/>
            </Switch>
          </div>
          <SidebarContainer />
        </div>
      </div>
    )
  }
}
