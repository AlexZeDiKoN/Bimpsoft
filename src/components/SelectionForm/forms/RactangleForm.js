import React, { Fragment } from 'react'
import { compose } from 'redux'
import {
  AbstractShapeForm,
  WithColor,
  WithFill,
  WithLineType,
  WithTwoCoordinates,
  WithSubordinationLevel,
} from '../parts/index'

export default class RactangleForm extends
  compose(WithSubordinationLevel, WithTwoCoordinates, WithColor, WithFill, WithLineType)(AbstractShapeForm) {
  static propTypes = {
    ...AbstractShapeForm.propTypes,
    ...WithColor.propTypes,
    ...WithFill.propTypes,
    ...WithLineType.propTypes,
    ...WithTwoCoordinates.propTypes,
    ...WithSubordinationLevel.propTypes,
  }

  renderContent () {
    return (
      <Fragment>
        {this.renderSubordinationLevel()}
        {this.renderColor()}
        {this.renderFill()}
        {this.renderLineType()}
        {this.renderTwoCoordinates()}
      </Fragment>
    )
  }
}
