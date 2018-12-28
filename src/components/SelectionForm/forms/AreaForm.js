import React, { Fragment } from 'react'
import { compose } from 'redux'
import {
  AbstractShapeForm,
  WithColor,
  WithFill,
  WithSegment,
  WithLineType,
  WithLineAmplifiers,
  WithLineNodes,
  WithCoordinatesArray,
  WithSubordinationLevel,
  WithStrokeWidth,
} from '../parts'

const Extenders = compose(
  WithSubordinationLevel,
  WithCoordinatesArray,
  WithLineType,
  WithLineAmplifiers,
  WithLineNodes,
  WithSegment,
  WithFill,
  WithColor,
  WithStrokeWidth,
)

export default class AreaForm extends Extenders(AbstractShapeForm) {
  static propTypes = AbstractShapeForm.propTypes

  renderContent () {
    return (
      <Fragment>
        {this.renderSubordinationLevel()}
        {this.renderColor()}
        {this.renderStrokeWidth()}
        {this.renderFill()}
        {this.renderSegment()}
        {this.renderLineType()}
        {this.renderLineAmplifiers()}
        {this.renderLineNodes()}
        {this.renderCoordinatesArray()}
      </Fragment>
    )
  }
}
