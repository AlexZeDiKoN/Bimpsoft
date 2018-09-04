import React, { Fragment } from 'react'
import { compose } from 'redux'
import {
  AbstractShapeForm,
  WithColor,
  WithSegment,
  WithLineType,
  WithCoordinatesArray,
  WithSubordinationLevel,
} from '../parts/index'

export default class LineForm extends
  compose(WithSubordinationLevel, WithCoordinatesArray, WithLineType, WithSegment, WithColor)(AbstractShapeForm) {
  static propTypes = {
    ...AbstractShapeForm.propTypes,
    ...WithColor.propTypes,
    ...WithSegment.propTypes,
    ...WithLineType.propTypes,
    ...WithCoordinatesArray.propTypes,
    ...WithSubordinationLevel.propTypes,
  }

  renderContent () {
    return (
      <Fragment>
        {this.renderSubordinationLevel()}
        {this.renderColor()}
        {this.renderSegment()}
        {this.renderLineType()}
        {this.renderCoordinatesArray()}
      </Fragment>
    )
  }
}
