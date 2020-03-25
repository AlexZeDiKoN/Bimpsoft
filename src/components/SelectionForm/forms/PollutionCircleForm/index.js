import { compose } from 'redux'
import React from 'react'
import { Scrollbar } from '@DZVIN/CommonComponents'
import AbstractShapeForm, {
  propTypes as abstractShapeFormPropTypes,
} from '../../parts/AbstractShapeForm'
import {
  WithColor,
  WithCoordinateAndAzimut,
  WithSubordinationLevel,
  WithStrokeWidth,
  UnitSelect,
  WithAffiliation,
  WithTwoCoordinates,
  // WithRadiusArray,
} from '../../parts'

import './PollutionCircleForm.css'
import spriteUrl from '../../../Symbols/sprite.svg'

export default class PollutionCircleForm extends compose(
  UnitSelect,
  WithSubordinationLevel,
  WithAffiliation,
  WithCoordinateAndAzimut,
  WithColor,
  WithStrokeWidth,
  WithTwoCoordinates,
  // WithRadiusArray,
)(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  renderContent () {
    const name = this.props.data.code // 10032500000017076000, 10032500001405000000,
    return (
      <Scrollbar>
        <div className="pollutioncircle-container">
          <div className="pollutioncircle-container__item--firstSection">
            <div>
              <svg key={name}>
                <use xlinkHref={`${spriteUrl}#${name}`}/>
              </svg>
            </div>
            <div className="pollutioncircle-container__itemWidth-left">
              {this.renderSubordinationLevel()}
              {this.renderOrgStructureSelect()}
            </div>
            <div className="pollutioncircle-container__itemWidth-right">
              {this.renderAffiliation()}
              {this.renderTwoCoordinates()}
            </div>
          </div>
          <div className="pollutioncircle-container__item--secondSection">
            <div className="pollutioncircle-container__itemWidth">
              <div className="containerTypeColor">
                {this.renderColor()}
                {this.renderStrokeWidth()}
              </div>
            </div>
          </div>
        </div>
      </Scrollbar>
    )
  }
}
