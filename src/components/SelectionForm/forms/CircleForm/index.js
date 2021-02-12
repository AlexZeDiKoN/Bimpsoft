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
  WithCatalogsFields,
} from '../../parts'
import AbstractShapeForm, { propTypes as abstractShapeFormPropTypes } from '../../parts/AbstractShapeForm'
import './CircleForm.css'

class CircleForm extends
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

const CircleFormWithDecorator = WithCatalogsFields(CircleForm)

export default CircleFormWithDecorator
