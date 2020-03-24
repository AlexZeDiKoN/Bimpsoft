import { compose } from 'redux'
import React from 'react'
import { Scrollbar } from '@DZVIN/CommonComponents'
import {
  WithColor,
  WithSegment,
  WithPointAmplifiers,
  WithIntermediateAmplifiers,
  WithCoordinatesArray,
  WithSubordinationLevel,
  WithStrokeWidth,
  UnitSelect,
  WithAffiliation,
} from '../../parts'
import AbstractShapeForm, { propTypes as abstractShapeFormPropTypes } from '../../parts/AbstractShapeForm'
import './AirborneForm.css'
import WithStatus from '../../parts/WithStatus'
import spriteUrl from '../../../Symbols/sprite.svg'

export default class AirborneForm extends compose(
  WithSubordinationLevel,
  WithCoordinatesArray,
  WithPointAmplifiers,
  WithIntermediateAmplifiers,
  WithSegment,
  WithColor,
  WithStrokeWidth,
  UnitSelect,
  WithAffiliation,
  WithStatus,
)(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  renderContent () {
    const name = this.props.data.code // '10032500001514030000'
    return (
      <Scrollbar>
        <div className="airborne-container">
          <div className="airborne-container__item--firstSection">
            <div className="airborne-container__itemWidth-left">
              <svg key={name}>
                <use xlinkHref={`${spriteUrl}#${name}`}/>
              </svg>
            </div>
            <div className="airborne-container__itemWidth-right">
              {this.renderOrgStructureSelect()}
              {this.renderSubordinationLevel()}
              {this.renderAffiliation()}
              {this.renderStatus()}
            </div>
          </div>
          <div className="airborne-container__item--secondSection">
            <div className="airborne-container__itemWidth">
              <div>
                {this.renderColor()}
                {this.renderStrokeWidth()}
                {this.renderSegment()}
              </div>
            </div>
          </div>
          {this.renderPointAmplifiers()}
          {this.renderCoordinatesArray()}
        </div>
      </Scrollbar>
    )
  }
}
