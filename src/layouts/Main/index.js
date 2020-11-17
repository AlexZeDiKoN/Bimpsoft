import React from 'react'
import {
  Route,
  Switch,
} from 'react-router-dom'
import { MovablePanel } from '@C4/CommonComponents'
import {
  LeftMenuContainer,
  RightMenuContainer,
  SelectionFormContainer,
  TemplateFormContainer,
  // TODO: поки що приховуємо панель шаблонів
  // TemplatesListContainer,
  SettingsFormContainer,
  MapSourceSelectContainer,
  SelectionButtonsContainer,
  CreateButtonsContainer,
  FlexGridButtonsContainer,
  FlexGridOptionsContainer,
  DirectionNameContainer,
  TopoObjModal,
  EternalDescriptionContainer,
  TaskModalContainer,
  ReportMapModalContainer,
  GeoLandmarkModalContainer,
  DeleteMarchModalContainer,
  ZoneProfileModalContainer,
  ZoneVisionModalContainer,
} from '../../containers'
import { ApplicationContent } from '../../layouts'
import './Main.css'
import SidebarContainer from '../../containers/SidebarContainer'
import { HotKeysContainer } from '../../components/common/HotKeys'
import ElevationProfileModal from "../../components/ElevationProfileModal";

export default class Main extends React.Component {
  render () {
    return (
      <HotKeysContainer id="main" className="main">
        <div className="header">
          <div className="header-top">
            <div className="header-left">
              <LeftMenuContainer
                createButtonsComponent={CreateButtonsContainer}
                mapSourceSelectComponent={MapSourceSelectContainer}
                selectionButtonsComponent={SelectionButtonsContainer}
                flexGridButtonsComponent={FlexGridButtonsContainer}
              />
            </div>
            <div className="header-right">
              <RightMenuContainer/>
            </div>
          </div>
          <div className="header-bottom">
            {/* <TemplatesListContainer/> */}
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
        <SelectionFormContainer wrapper={MovablePanel} />
        <TemplateFormContainer wrapper={MovablePanel} />
        <SettingsFormContainer wrapper={MovablePanel} />
        <FlexGridOptionsContainer wrapper={MovablePanel} />
        <DirectionNameContainer wrapper={MovablePanel}/>
        <EternalDescriptionContainer wrapper={MovablePanel}/>
        <TopoObjModal wrapper={MovablePanel} />
        <ZoneProfileModalContainer wrapper={MovablePanel} />
        <ZoneVisionModalContainer wrapper={MovablePanel} />
        <TaskModalContainer wrapper={MovablePanel} />
        <ReportMapModalContainer wrapper={MovablePanel} />
        <GeoLandmarkModalContainer wrapper={MovablePanel} />
        <DeleteMarchModalContainer wrapper={MovablePanel} />
        <ElevationProfileModal/>
      </HotKeysContainer>
    )
  }
}
