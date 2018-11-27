import React, { Fragment } from 'react'
import { compose } from 'redux'
import {
  AbstractShapeForm,
  WithColor,
  WithFill,
  WithLineType,
  WithTwoCoordinates,
  WithSubordinationLevel,
  WithStrokeWidth,
} from '../parts/index'

export default class RectangleForm extends
  compose(
    WithSubordinationLevel,
    WithTwoCoordinates,
    WithColor,
    WithFill,
    WithLineType,
    WithStrokeWidth
  )(AbstractShapeForm) {
  static propTypes = {
    ...AbstractShapeForm.propTypes,
    ...WithColor.propTypes,
    ...WithFill.propTypes,
    ...WithLineType.propTypes,
    ...WithTwoCoordinates.propTypes,
    ...WithSubordinationLevel.propTypes,
    ...WithStrokeWidth.propTypes,
  }

  renderContent () {
    return (
      <Fragment>
        {this.renderSubordinationLevel()}
        {this.renderColor()}
        {this.renderStrokeWidth()}
        {this.renderFill()}
        {this.renderLineType(true)}
        {this.renderTwoCoordinates()}
      </Fragment>
    )
  }
}
