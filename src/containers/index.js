import React from 'react'
import i18n from '../i18n'
import MainMenuLeftContainer from './MainMenuLeftContainer.js'
import MainMenuRightContainer from './MainMenuRightContainer.js'
import LayersContainer from './LayersContainer.js'
import OrgStructuresContainer from './OrgStructuresContainer.js'
import MilSymbolGeneratorContainer from './MilSymbolGeneratorContainer.js'
import SelectionFormContainer from './SelectionFormContainer.js'
import TemplateFormContainer from './TemplateFormContainer.js'

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
  MainMenuLeftContainer,
  MainMenuRightContainer,
  LayersContainer,
  SelectionFormContainer,
  TemplateFormContainer,
  panels,
}
