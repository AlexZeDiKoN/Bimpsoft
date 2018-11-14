import React, { Fragment } from 'react'
import { compose } from 'redux'
import { DIRECTION_LEFT, DIRECTION_RIGHT } from '../parts/WithLineEnds'
import {
  AbstractShapeForm,
  WithColor,
  WithSegment,
  WithLineType,
  WithLineAmplifiers,
  WithLineNodes,
  WithLineEnds,
  WithCoordinatesArray,
  WithSubordinationLevel,
} from '../parts/index'

export default class LineForm extends
  compose(
    WithSubordinationLevel,
    WithCoordinatesArray,
    WithLineType,
    WithLineAmplifiers,
    WithLineNodes,
    WithLineEnds,
    WithSegment,
    WithColor,
  )(AbstractShapeForm) {
  static propTypes = {
    ...AbstractShapeForm.propTypes,
    ...WithColor.propTypes,
    ...WithSegment.propTypes,
    ...WithLineType.propTypes,
    ...WithLineAmplifiers.propTypes,
    ...WithLineNodes.propTypes,
    ...WithLineEnds.propTypes,
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
        {this.renderLineNodes()}
        {this.renderLineEnds(DIRECTION_LEFT)}
        {this.renderLineEnds(DIRECTION_RIGHT)}
        {this.renderCoordinatesArray()}
      </Fragment>
    )
  }
}
