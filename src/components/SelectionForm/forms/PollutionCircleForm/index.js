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
  WithStartingCoordinate,
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
  WithStartingCoordinate,
  // WithRadiusArray,
)(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  renderContent () {
    const name = this.props.data.code
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
              {this.renderStartingCoordinate()}
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
