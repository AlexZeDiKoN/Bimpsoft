import React from 'react'
import { compose } from 'redux'
import {
  WithColor,
  WithFill,
  WithCoordinateAndWidth,
  WithSubordinationLevel,
  WithLineType,
  WithStrokeWidth,
} from '../../parts'
import AbstractShapeForm, { propTypes as abstractShapeFormPropTypes } from '../../parts/AbstractShapeForm'
import './SquareForm.css'

export default class SquareForm extends
  compose(
    WithSubordinationLevel,
    WithCoordinateAndWidth,
    WithColor,
    WithFill,
    WithLineType,
    WithStrokeWidth
  )(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  renderContent () {
    return (
      <div className="square-container">
        <div className="square-container__item">
          <div className="square-container__itemWidth">
            {this.renderSubordinationLevel()}
            {this.renderColor()}
            {this.renderStrokeWidth()}
          </div>
          <div className="square-container__itemWidth">
            {this.renderFill()}
            {this.renderLineType(true)}
          </div>
        </div>
        {this.renderCoordinateAndWidth()}
      </div>
    )
  }
}
