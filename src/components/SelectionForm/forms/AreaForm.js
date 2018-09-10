import React, { Fragment } from 'react'
import { compose } from 'redux'
import {
  AbstractShapeForm,
  WithColor,
  WithFill,
  WithSegment,
  WithLineType,
  WithCoordinatesArray,
  WithSubordinationLevel,
} from '../parts/index'

const Extanders = compose(WithSubordinationLevel, WithCoordinatesArray, WithLineType, WithSegment, WithFill, WithColor)

export default class AreaForm extends Extanders(AbstractShapeForm) {
  static propTypes = {
    ...AbstractShapeForm.propTypes,
    ...WithColor.propTypes,
    ...WithFill.propTypes,
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
        {this.renderFill()}
        {this.renderSegment()}
        {this.renderLineType()}
        {this.renderCoordinatesArray()}
      </Fragment>
    )
  }
}
