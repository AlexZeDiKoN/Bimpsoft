import React, { Fragment } from 'react'
import { compose } from 'redux'
import {
  AbstractShapeForm,
  WithColor,
  WithFill,
  WithCoordinateAndWidth,
  WithSubordinationLevel,
  WithLineType,
} from '../parts/index'

export default class SquareForm extends
  compose(WithSubordinationLevel, WithCoordinateAndWidth, WithColor, WithFill, WithLineType)(AbstractShapeForm) {
  static propTypes = {
    ...AbstractShapeForm.propTypes,
    ...WithColor.propTypes,
    ...WithFill.propTypes,
    ...WithLineType.propTypes,
    ...WithCoordinateAndWidth.propTypes,
    ...WithSubordinationLevel.propTypes,
  }

  renderContent () {
    return (
      <Fragment>
        {this.renderSubordinationLevel()}
        {this.renderColor()}
        {this.renderFill()}
        {this.renderLineType(true)}
        {this.renderCoordinateAndWidth()}
      </Fragment>
    )
  }
}
