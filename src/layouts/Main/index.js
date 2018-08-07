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

const ModalContainer = (props) => (
  <div className="modal-container">
    <MovablePanel {...props} />
  </div>
)

export default class Main extends React.Component {
  render () {
    return (
      <div id="main" className="main">
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
          <div className="app-content">
            <Switch>
              <Route exact path='/' component={ApplicationContent}/>
            </Switch>
          </div>
          <SidebarContainer />
        </div>
        <SelectionFormContainer wrapper={ ModalContainer }/>
        <TemplateFormContainer wrapper={ ModalContainer }/>
        <SettingsFormContainer wrapper={ ModalContainer }/>
      </div>
    )
  }
}
