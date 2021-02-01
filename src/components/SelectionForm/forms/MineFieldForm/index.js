import { compose } from 'redux'
import React from 'react'
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
import { amps } from '../../../../constants/symbols'
import { PATH_AMPLIFIERS } from '../../parts/WithAmplifiers'
import { PROPERTY_PATH as PATH } from '../../../../constants/propertyPath'
import SelectionTacticalSymbol from '../../parts/SelectionTacticalSymbol'
import SelectionTypes from '../../../../constants/SelectionTypes'

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
    const elem = <div className="containers-svg-tooltip">
      {svgMines}
    </div>
    const result = this.getResult()
    return (
      <div className="minefield-container">
        <div className='scroll-container'>
          <SelectionTacticalSymbol
            code={result.getIn(PATH.CODE)}
            type={result.getIn(PATH.TYPE) ?? SelectionTypes.SOPHISTICATED}
            attributes={ result.getIn(PATH.ATTRIBUTES).toJS()}
            onChange={this.onChangeTacticalSymbol}
          />
          <div className="minefield-container__item--firstSection">
            <div className="minefield-container__itemWidth-right">
              {this.renderSubordinationLevel()}
              {this.renderOrgStructureSelect()}
              {this.renderStatus()}
              {this.renderAffiliation()}
              {this.renderDummy()}
            </div>
          </div>
          <div className="minefield-container__item--secondSection">
            <div className="minefield-container__itemWidth">
              {this.renderMineType()}
              <div className="containerTypeColor">
                {this.renderControllability()}
                {this.renderColor()}
              </div>
            </div>
            {this.renderAmplifiers(PAIRS_AMPLIFIERS, PATH_AMPLIFIERS, false, elem)}
            {this.renderStartingCoordinate()}
          </div>
        </div>
      </div>
    )
  }
}
