import { compose } from 'redux'
import React from 'react'
import { components, Scrollbar } from '@DZVIN/CommonComponents'
// import { FlagsForm } from '@DZVIN/MilSymbolEditor/src/SymbolEditorComponent/FlagsForm'
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
import spriteUrl from '../../../Symbols/sprite.svg'

const { FormRow } = components.form

const PAIRS_AMPLIFIERS = [
  { id: 'middle', name: 'N' },
  { id: 'top', name: 'H1' },
  { id: 'bottom', name: 'H2' },
]

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
    const name = this.props.data.code
    return (
      <Scrollbar>
        <div className="minefield-container">
          <div className="minefield-container__item--firstSection">
            <div className="line-container__itemWidth-left">
              <svg key={name}>
                <use xlinkHref={`${spriteUrl}#${name}`}/>
              </svg>
            </div>
            <div className="line-container__itemWidth-right">
              <div>
                {this.renderSubordinationLevel()}
                {this.renderOrgStructureSelect()}
                {this.renderStatus()}
              </div>
              <div>
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
                <FormRow label='Колір'>
                  {this.renderColor()}
                </FormRow>
              </div>
            </div>
            {this.renderAmplifiers(PAIRS_AMPLIFIERS)}
          </div>
        </div>
      </Scrollbar>
    )
  }
}
