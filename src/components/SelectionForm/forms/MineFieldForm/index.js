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
import { amps } from '../../../../constants/symbols'

const { FormRow } = components.form

const PAIRS_AMPLIFIERS = [
  { id: amps.N, name: 'N', maxRows: 1 },
  { id: amps.T, name: 'H1', maxRows: 1 },
  { id: amps.W, name: 'H2', maxRows: 1 },
]

const svgMines = <svg viewBox="0 0 1024 640">
  <circle cx="332" cy="320" r="56"/>
  <circle cx="512" cy="320" r="56"/>
  <circle cx="692" cy="320" r="56"/>
  <path d="M226 220h572v200h-572zM24 240h160v160h-160zM840 240h160v160h-160zM432 16h172v172h-172zM432 448h172v172h-172z"
    fill="none" stroke="#000" strokeLinejoin="bevel" strokeWidth="12">
  </path>
  <g fontSize="112" fontFamily="Arial" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" fill="black"
    textAnchor="middle" alignmentBaseline="middle">
    <text x="104" y="364" >N</text>
    <text x="920" y="364" >N</text>
    <text x="520" y="144" >H1</text>
    <text x="520" y="580" >H2</text>
  </g>
</svg>

export default class MineFieldForm extends compose(
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
