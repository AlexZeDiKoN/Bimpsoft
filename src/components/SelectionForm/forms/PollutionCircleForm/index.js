import { compose } from 'redux'
import React from 'react'
import { Scrollbar } from '@C4/CommonComponents'
import AbstractShapeForm, {
  propTypes as abstractShapeFormPropTypes,
} from '../../parts/AbstractShapeForm'
import {
  WithColor,
  WithSubordinationLevel,
  WithStrokeWidth,
  UnitSelect,
  WithAffiliation,
  WithStartingCoordinate,
  WithRadii,
} from '../../parts'

import './PollutionCircleForm.css'
import spriteUrl from '../../../Symbols/sprite.svg'

export default class PollutionCircleForm extends compose(
  UnitSelect,
  WithSubordinationLevel,
  WithAffiliation,
  WithColor,
  WithStrokeWidth,
  WithStartingCoordinate,
  WithRadii,
)(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  renderContent () {
    const name = this.props.data.code
    return (
      <Scrollbar>
        <div className="pollutioncircle-container">
          <div className='pollutioncircle-container__itemWidth-left'>
            <svg key={name}>
              <use xlinkHref={`${spriteUrl}#${name}`}/>
            </svg>
          </div>
          <div className='scroll-container'>
            <div className="pollutioncircle-container__item--firstSection">
              <div className="pollutioncircle-container__itemWidth-right">
                {this.renderSubordinationLevel()}
                {this.renderOrgStructureSelect()}
                {this.renderAffiliation(true)}
                <div className='coordinate-container-border'>
                  {this.renderStartingCoordinate()}
                </div>
              </div>
            </div>
            <div className="pollutioncircle-container__item--secondSection">
              <div className="pollutioncircle-container__itemWidth">
                {this.renderRadii()}
              </div>
            </div>
          </div>
        </div>
      </Scrollbar>
    )
  }
}
