import React, { Fragment } from 'react'
import {
  AbstractShapeForm,
  WithColor,
  WithSegment,
  WithCoordinatesArray,
} from './common/index'

export default class RactangleForm extends WithCoordinatesArray(WithSegment(WithColor(AbstractShapeForm))) {
  static propTypes = {
    ...AbstractShapeForm.propTypes,
    ...WithColor.propTypes,
    ...WithSegment.propTypes,
    ...WithCoordinatesArray.propTypes,
  }

  renderContent () {
    return (
      <Fragment>
        {this.renderColor()}
        {this.renderSegment()}
        {this.renderCoordinatesArray()}
      </Fragment>
    )
  }
}
