import React from 'react'
import i18n from '../i18n'
import LeftMenuContainer from './LeftMenuContainer'
import RightMenuContainer from './RightMenuContainer'
import LayersContainer from './LayersContainer.js'
import OrgStructuresContainer from './OrgStructuresContainer.js'
import MilSymbolGeneratorContainer from './MilSymbolGeneratorContainer.js'
import SelectionFormContainer from './SelectionFormContainer.js'
import TemplateFormContainer from './TemplateFormContainer.js'
import TemplatesListContainer from './TemplatesListContainer.js'
import SettingsFormContainer from './SettingsFormContainer.js'

const panels = {
  history: {
    title: i18n.HISTORY,
    component: (<div>asdfas dfasd sadf sdfas df</div>),
  },
  structure: {
    title: i18n.ORG_STRUCTURE,
    component: (<OrgStructuresContainer/>),
  },
  layers: {
    title: i18n.LAYERS,
    component: (<LayersContainer/>),
  },
  milTemplate: {
    title: i18n.MIL_TEMPLATE,
    component: (<MilSymbolGeneratorContainer/>),
  },
}

export {
  LeftMenuContainer,
  RightMenuContainer,
  SettingsFormContainer,
  LayersContainer,
  SelectionFormContainer,
  TemplateFormContainer,
  TemplatesListContainer,
  panels,
}
