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
  )(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  renderContent () {
    return (
      <div className="circle-container">
        <div className="circle-container__item">
          <div className="circle-container__itemWidth">
            {this.renderSubordinationLevel()}
            {this.renderOrgStructureSelect()}
            {this.renderStrokeWidth()}
          </div>
          <div className="circle-container__itemWidth">
            {this.renderColor()}
            {this.renderFill()}
            {this.renderLineType(true)}
          </div>
        </div>
        {this.renderCoordinateAndRadius()}
      </div>
    )
  }
}
