import React from 'react'
import { compose } from 'redux'
import {
  WithColor,
  WithFill,
  WithCoordinateAndRadius,
  WithSubordinationLevel,
  WithLineType,
  WithStrokeWidth,
  UnitSelect,
  WithPointAmplifiers,
} from '../../parts'
import AbstractShapeForm, { propTypes as abstractShapeFormPropTypes } from '../../parts/AbstractShapeForm'
import './CircleForm.css'

export default class SquareForm extends
  compose(
    WithSubordinationLevel,
    WithCoordinateAndRadius,
    WithColor,
    WithFill,
    WithLineType,
    WithStrokeWidth,
    UnitSelect,
    WithPointAmplifiers,
  )(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  renderContent () {
    return (
      <div className="circle-container">
        <div className='scroll-container'>
          <div className="circle-container__item--firstSection">
            <div className="circle-container__itemWidth-right">
              {this.renderSubordinationLevel()}
              {this.renderOrgStructureSelect()}
            </div>
          </div>
          <div className="circle-container__item--secondSection">
            <div className="circle-container__itemWidth">
              <div className='containerTypeColor'>
                {this.renderLineType(true)}
                {this.renderColor()}
              </div>
              {this.renderStrokeWidth()}
            </div>
            {this.renderFill()}
          </div>
          {this.renderPointAmplifiers()}
          {this.renderCoordinateAndRadius()}
        </div>
      </div>
    )
  }
}
