import { compose } from 'redux'
import React from 'react'
import { components } from '@DZVIN/CommonComponents'
import AbstractShapeForm, {
  propTypes as abstractShapeFormPropTypes,
} from '../../parts/AbstractShapeForm'

import {
  UnitSelect,
  WithSubordinationLevel,
  WithStatus,
  WithStartingCoordinate,
  WithAffiliation,
  WithDummy,
  WithMineType,
  WithControllability,
  WithColor,
  WithAmplifiers,
} from '../../parts'

import './MineFieldForm.css'
// import spriteUrl from '../../../Symbols/sprite.svg'
import i18n from '../../../../i18n'

const { FormRow } = components.form

const PAIRS_AMPLIFIERS = [
  { id: 'middle', name: 'N' },
  { id: 'top', name: 'H1' },
  { id: 'bottom', name: 'H2' },
]

const svgMines = <svg viewBox="0 0 1024 640">
  <circle cx="332" cy="320" r="56"/>
  <circle cx="512" cy="320" r="56"/>
  <circle cx="692" cy="320" r="56"/>
  <path d="M226 220h572v200h-572z
   M24 240h160v160h-160zm52 120v-80l56 80v-80
   M840 240h160v160h-160zm52 120v-80l56 80v-80
   M432 16h172v172h-172zm32 40v96m0-48h48m0-48v96m24-4h48m-24 0v-92l-20 20
   M432 448h172v172h-172zm32 40v96m0-48h48m0-48v96m72-4h-48l40-64c0-32-40-32-40 0"
  fill="none" stroke="#000" strokeLinejoin="bevel" strokeWidth="12">
  </path>
</svg>

export default class PollutionCircleForm extends compose(
  UnitSelect,
  WithSubordinationLevel,
  WithStatus,
  WithStartingCoordinate,
  WithAffiliation,
  WithDummy,
  WithMineType,
  WithControllability,
  WithColor,
  WithAmplifiers,
)(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  renderContent () {
    return (
      <div className="minefield-container">
        <div className="minefield-container__item--firstSection">
          <div className="line-container__itemWidth-left">
            {svgMines}
          </div>
          <div className="line-container__itemWidth-right">
            <div className="line-container__itemWidth">
              {this.renderSubordinationLevel()}
              {this.renderOrgStructureSelect()}
              {this.renderStatus()}
            </div>
            <div className="line-container__itemWidth">
              {this.renderStartingCoordinate()}
              {this.renderAffiliation()}
              {this.renderDummy()}
            </div>
          </div>
        </div>
        <div className="minefield-container__item--secondSection">
          <div className="line-container__itemWidth">
            <div className="line-container__itemWidth30">
              {this.renderMineType()}
            </div>
            <div className="line-container__itemWidth30">
              {this.renderControllability()}
            </div>
            <div className="line-container__itemWidth30">
              <FormRow label={i18n.LINE_COLOR}>
                {this.renderColor()}
              </FormRow>
            </div>
          </div>
          <div className="line-container__itemWidth">
            {this.renderAmplifiers(PAIRS_AMPLIFIERS)}
          </div>
        </div>
      </div>
    )
  }
}
