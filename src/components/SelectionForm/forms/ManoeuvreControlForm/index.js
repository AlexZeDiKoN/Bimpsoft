import { compose } from 'redux'
import React from 'react'
import { Scrollbar } from '@DZVIN/CommonComponents'
import {
  WithColor,
  WithSegment,
  WithPointAmplifiers,
  WithIntermediateAmplifiers,
  WithCoordinates,
  WithSubordinationLevel,
  WithStrokeWidth,
  UnitSelect,
  WithAffiliation,
} from '../../parts'
import AbstractShapeForm, { propTypes as abstractShapeFormPropTypes } from '../../parts/AbstractShapeForm'
import './ManoeuvreControlForm.css'
import WithStatus from '../../parts/WithStatus'
import spriteUrl from '../../../Symbols/sprite.svg'

export default class ManoeuvreForm extends compose(
  WithSubordinationLevel,
  WithCoordinates,
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
    const name = this.props.data.code // '100325000015140*0000'
    return (
      <Scrollbar>
        <div className="manoeuvre-container">
          <div className="manoeuvre-container__item--firstSection">
            <div className="manoeuvre-container__itemWidth-left">
              <svg key={name}>
                <use xlinkHref={`${spriteUrl}#${name}`}/>
              </svg>
            </div>
            <div className="manoeuvre-container__itemWidth-right">
              {this.renderOrgStructureSelect()}
              {this.renderSubordinationLevel()}
              {this.renderAffiliation()}
            </div>
          </div>
          <div className="manoeuvre-container__item--secondSection">
            <div className="manoeuvre-container__itemWidth">
              <div className="containerTypeColor">
                {this.renderColor()}
                {this.renderStrokeWidth()}
                {this.renderSegment()}
              </div>
            </div>
          </div>
          {this.renderPointAmplifiers()}
          {this.renderCoordinates()}
        </div>
      </Scrollbar>
    )
  }
}
