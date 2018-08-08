import React from 'react'
import {
  Route,
  Switch,
} from 'react-router-dom'
import {
  LeftMenuContainer,
  RightMenuContainer,
  SelectionFormContainer,
  TemplateFormContainer,
  TemplatesListContainer,
  SettingsFormContainer,
  MapsSourcesContainer,
} from '../../containers'
import { ApplicationContent } from '../../layouts'
import './Main.css'
import SidebarContainer from '../../containers/SidebarContainer'
import ModalContainer from '../../components/common/ModalContainer'

export default class Main extends React.Component {
  render () {
    const mapSources = (<MapsSourcesContainer/>)
    return (
      <div id="main" className="main">
        <div className="header">
          <div className="header-top">
            <div className="header-left">
              <LeftMenuContainer mapSources={mapSources}/>
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
