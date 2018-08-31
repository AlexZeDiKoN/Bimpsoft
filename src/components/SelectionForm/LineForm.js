import React, { Fragment } from 'react'
import {
  AbstractShapeForm,
  WithColor,
  WithSegment,
  WithLineType,
  WithCoordinatesArray,
} from './common/index'

export default class LineForm extends WithCoordinatesArray(WithLineType(WithSegment(WithColor(AbstractShapeForm)))) {
  static propTypes = {
    ...AbstractShapeForm.propTypes,
    ...WithColor.propTypes,
    ...WithSegment.propTypes,
    ...WithLineType.propTypes,
    ...WithCoordinatesArray.propTypes,
  }

  renderContent () {
    return (
      <Fragment>
        {this.renderColor()}
        {this.renderSegment()}
        {this.renderLineType()}
        {this.renderCoordinatesArray()}
      </Fragment>
    )
  }
}
