import React, { Fragment } from 'react'
import { compose } from 'redux'
import {
  AbstractShapeForm,
  WithColor,
  WithFill,
  WithSegment,
  WithLineType,
  WithLineAmplifiers,
  WithCoordinatesArray,
  WithSubordinationLevel,
} from '../parts/index'

const Extenders = compose(
  WithSubordinationLevel, WithCoordinatesArray, WithLineType, WithLineAmplifiers, WithSegment, WithFill, WithColor
)

export default class AreaForm extends Extenders(AbstractShapeForm) {
  static propTypes = {
    ...AbstractShapeForm.propTypes,
    ...WithColor.propTypes,
    ...WithFill.propTypes,
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
        {this.renderFill()}
        {this.renderSegment()}
        {this.renderLineType()}
        {this.renderLineAmplifiers()}
        {this.renderCoordinatesArray()}
      </Fragment>
    )
  }
}
