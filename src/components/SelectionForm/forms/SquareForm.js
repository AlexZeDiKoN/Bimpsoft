import React, { Fragment } from 'react'
import { compose } from 'redux'
import {
  AbstractShapeForm,
  WithColor,
  WithFill,
  WithCoordinateAndWidth,
  WithSubordinationLevel,
} from '../parts/index'

export default class SquareForm extends
  compose(WithSubordinationLevel, WithCoordinateAndWidth, WithColor, WithFill)(AbstractShapeForm) {
  static propTypes = {
    ...AbstractShapeForm.propTypes,
    ...WithColor.propTypes,
    ...WithFill.propTypes,
    ...WithCoordinateAndWidth.propTypes,
    ...WithSubordinationLevel.propTypes,
  }

  renderContent () {
    return (
      <Fragment>
        {this.renderSubordinationLevel()}
        {this.renderColor()}
        {this.renderFill()}
        {this.renderCoordinateAndWidth()}
      </Fragment>
    )
  }
}
