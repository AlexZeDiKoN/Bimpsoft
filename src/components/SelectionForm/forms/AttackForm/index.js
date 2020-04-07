import { compose } from 'redux'
import React from 'react'
import { components } from '@DZVIN/CommonComponents'
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
import i18n from '../../../../i18n'
import spriteUrl from '../../../Symbols/sprite.svg'
import { amps } from '../../../../constants/symbols'

const { FormRow, FormDarkPart } = components.form
const svgAmplifier = <svg viewBox="0 0 1024 1024">
  <path
    d="M570 400 h224 v224 h-224z m48 48h124h-62v142 M512 664v224h-224v-224z M332 724l32 96 l32-96 l32 96 l32-96"
    fill="white" strokeLinejoin="bevel" stroke="#000000" strokeWidth="10">
  </path>
</svg>

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
    return (
      <div className="attack-container">
        <div className="attack-container--firstSection">
          <div className="attack-container__item">
            <div className="attack-container__itemWidth">
              <svg>
                <use xlinkHref={`${spriteUrl}#${code}`}/>
                {svgAmplifier}
              </svg>
            </div>
            <div className="attack-container__itemWidth">
              {this.renderSubordinationLevel()}
              {this.renderOrgStructureSelect()}
              {this.renderAffiliation()}
              {this.renderStatus()}
            </div>
          </div>
        </div>
        <div className="attack-container--secondSection">
          <div className="attack-container__item">
            {this.renderStrokeWidth()}
            <FormRow label={i18n.LINE_COLOR}>
              {this.renderColor()}
            </FormRow>
          </div>
          <div className="attack-container__item">
            {this.renderAmplifiers(PAIRS_AMPLIFIERS)}
          </div>
          <div className="attack-container__item">
            <FormDarkPart>
              {this.renderCoordinates()}
            </FormDarkPart>
          </div>
        </div>
      </div>
    )
  }
}
