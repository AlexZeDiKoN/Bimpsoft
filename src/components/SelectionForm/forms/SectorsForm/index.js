import { compose } from 'redux'
import React from 'react'
import { Scrollbar } from '@DZVIN/CommonComponents'
import {
  WithColor,
  WithSegment,
  WithPointAmplifiers,
  WithIntermediateAmplifiers,
  WithCoordinateBegin,
  WithSubordinationLevel,
  WithStrokeWidth,
  UnitSelect,
  WithAffiliation,
} from '../../parts'
import AbstractShapeForm, { propTypes as abstractShapeFormPropTypes } from '../../parts/AbstractShapeForm'
import './SectorsForm.css'
import WithStatus from '../../parts/WithStatus'
import spriteUrl from '../../../Symbols/sprite.svg'

export default class SectorsForm extends compose(
  WithSubordinationLevel,
  WithCoordinateBegin,
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
    const name = this.props.data.code // 10032500000017076000, 10032500001405000000,
    return (
      <Scrollbar>
        <div className="sectors-container">
          <div className="sectors-container__item--firstSection">
            <div className="sectors-container__itemWidth-left">
              <svg key={name}>
                <use xlinkHref={`${spriteUrl}#${name}`}/>
              </svg>
            </div>
            <div className="sectors-container__itemWidth-right">
              {this.renderOrgStructureSelect()}
              {this.renderSubordinationLevel()}
              {this.renderAffiliation()}
              {this.renderCoordinateBegin()}
            </div>
          </div>
          <div className="sectors-container__item--secondSection">
            <div className="sectors-container__itemWidth">
              <div className="containerTypeColor">
                {this.renderColor()}
                {this.renderStrokeWidth()}
                {this.renderSegment()}
              </div>
            </div>
          </div>
          {this.renderPointAmplifiers()}
        </div>
      </Scrollbar>
    )
  }
}
