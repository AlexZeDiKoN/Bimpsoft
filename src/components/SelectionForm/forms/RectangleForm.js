import React from 'react'
import { compose } from 'redux'
import {
  WithColor,
  WithFill,
  WithLineType,
  WithTwoCoordinates,
  WithSubordinationLevel,
  WithStrokeWidth,
} from '../parts'
import AbstractShapeForm, { propTypes as abstractShapeFormPropTypes } from '../parts/AbstractShapeForm'

export default class RectangleForm extends
  compose(
    WithSubordinationLevel,
    WithTwoCoordinates,
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
        {this.renderTwoCoordinates()}
      </>
    )
  }
}
