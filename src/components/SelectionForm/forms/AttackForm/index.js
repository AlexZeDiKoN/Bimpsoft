import { compose } from 'redux'
import React from 'react'
import { components } from '@C4/CommonComponents'
import AbstractShapeForm, {
  propTypes as abstractShapeFormPropTypes,
} from '../../parts/AbstractShapeForm'

import {
  UnitSelect,
  WithSubordinationLevel,
  WithAffiliation,
  WithStatus,
  WithStrokeWidth,
  WithColor,
  WithAmplifiers,
  WithCoordinates,
} from '../../parts'

import './AttackForm.css'
import spriteUrl from '../../../Symbols/sprite.svg'
import { amps } from '../../../../constants/symbols'
import { PATH_AMPLIFIERS } from '../../parts/WithAmplifiers'
import { PROPERTY_PATH as PATH } from '../../../../constants/propertyPath'
import SelectionTacticalSymbol from '../../parts/SelectionTacticalSymbol'

const { FormDarkPart } = components.form
const svgAmplifier = <path
  d="M532 400h224v224h-224zm48 48h124h-62v128M512 664h-224v224h224zM336 724l32 96l32-96l32 96l32-96"
  fill="white" fillRule="nonzero" strokeLinejoin="bevel" stroke="#000000" strokeWidth="10">
</path>

const SVG = {
  // eslint-disable-next-line max-len
  '10032500001406010000': <path d="M24 512h120m0-72l130 72 134-72v144l-134-72-130 72V440zM400 512h580M882 440l104 72-104 72" fill="none" stroke="#000" strokeWidth="20"/>,
  // eslint-disable-next-line max-len
  '10032500001406020000': <path d="M24 512h882m-82-88v-56L970 512 824 656v-56L920 512l-96-88z" fill="none" stroke="#000" strokeWidth="20"/>,
  '10032500001406030000': <path d="M880 433l106 79L880 592M24 512h960" fill="none" stroke="#000" strokeWidth="20"/>,
  // eslint-disable-next-line max-len
  '10032500001406050000': <path d="M808 648l52-40m15-13l51-39M808 376l52 40m15 13l51 39m16 76l42-32-42-32M808 432l108 80L808 592M24 512h888" fill="none" stroke="#000" strokeWidth="20"/>,
}

const PAIRS_AMPLIFIERS = [
  { id: amps.T, name: 'T' },
  { id: amps.W, name: 'W' },
]

export default class SophisticatedForm extends compose(
  UnitSelect,
  WithSubordinationLevel,
  WithAffiliation,
  WithStatus,
  WithStrokeWidth,
  WithColor,
  WithAmplifiers,
  WithCoordinates,
)(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  renderContent () {
    const code = this.props.data.code
    const pathSymbol = SVG[code] || <use xlinkHref={`${spriteUrl}#${code}`}/>
    const elem =
      <div className='containers-svg-tooltip'>
        <svg viewBox="0 0 1024 1024">
          {pathSymbol}
          {svgAmplifier}
        </svg>
      </div>
    const result = this.getResult()
    return (
      <div className="attack-container">
        <div className='scroll-container'>
          <SelectionTacticalSymbol
            code={result.getIn(PATH.CODE)}
            type={result.getIn(PATH.TYPE)}
            attributes={result.getIn(PATH.ATTRIBUTES).toJS()}
            onChange={this.onChangeTacticalSymbol}
          />
          <div className="attack-container__item--firstSection">
            <div className="attack-container__itemWidth-right">
              {this.renderSubordinationLevel()}
              {this.renderOrgStructureSelect()}
              {this.renderAffiliation()}
              {this.renderStatus()}
            </div>
          </div>
          <div className="attack-container__item--secondSection">
            <div className="attack-container__itemWidth">
              <div className='containerTypeColor'>
                {this.renderStrokeWidth()}
                {this.renderColor()}
              </div>
            </div>
          </div>
          <div className="attack-container__item">
            <div className="attack-container__itemWidth50">
              {this.renderAmplifiers(PAIRS_AMPLIFIERS, PATH_AMPLIFIERS, false, elem)}
              <FormDarkPart>
                {this.renderCoordinates()}
              </FormDarkPart>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
