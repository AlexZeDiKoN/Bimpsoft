import React, { Fragment } from 'react'
import { compose } from 'redux'
import {
  AbstractShapeForm,
  WithColor,
  WithSegment,
  WithLineType,
  WithLineAmplifiers,
  WithCoordinatesArray,
  WithSubordinationLevel,
} from '../parts/index'

export default class LineForm extends
  compose(WithSubordinationLevel, WithCoordinatesArray, WithLineType, WithLineAmplifiers, WithSegment, WithColor)(AbstractShapeForm) {
  static propTypes = {
    ...AbstractShapeForm.propTypes,
    ...WithColor.propTypes,
    ...WithSegment.propTypes,
    ...WithLineType.propTypes,
    ...WithLineAmplifiers.propTypes,
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
        {this.renderLineAmplifiers()}
        {this.renderCoordinatesArray()}
      </Fragment>
    )
  }
}
