import React, { Fragment } from 'react'
import { compose } from 'redux'
import {
  AbstractShapeForm,
  WithColor,
  WithFill,
  WithCoordinateAndRadius,
  WithSubordinationLevel,
} from '../parts/index'

export default class SquareForm extends
  compose(WithSubordinationLevel, WithCoordinateAndRadius, WithColor, WithFill)(AbstractShapeForm) {
  static propTypes = {
    ...AbstractShapeForm.propTypes,
    ...WithColor.propTypes,
    ...WithFill.propTypes,
    ...WithCoordinateAndRadius.propTypes,
    ...WithSubordinationLevel.propTypes,
  }

  renderContent () {
    return (
      <Fragment>
        {this.renderSubordinationLevel()}
        {this.renderColor()}
        {this.renderFill()}
        {this.renderCoordinateAndRadius()}
      </Fragment>
    )
  }
}
