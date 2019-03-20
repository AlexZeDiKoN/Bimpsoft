import React from 'react'
import { compose } from 'redux'
import {
  WithColor,
  WithFill,
  WithCoordinateAndWidth,
  WithSubordinationLevel,
  WithLineType,
  WithStrokeWidth,
} from '../parts'
import AbstractShapeForm, { propTypes as abstractShapeFormPropTypes } from '../parts/AbstractShapeForm'

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
      <>
        {this.renderSubordinationLevel()}
        {this.renderColor()}
        {this.renderStrokeWidth()}
        {this.renderFill()}
        {this.renderLineType(true)}
        {this.renderCoordinateAndWidth()}
      </>
    )
  }
}
