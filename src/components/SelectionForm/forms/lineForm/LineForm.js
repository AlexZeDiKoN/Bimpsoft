import React from 'react'
import { compose } from 'redux'
import { DIRECTION_LEFT, DIRECTION_RIGHT } from '../../parts/WithLineEnds'
import {
  WithColor,
  WithSegment,
  WithLineType,
  WithLineAmplifiers,
  WithLineNodes,
  WithLineEnds,
  WithCoordinatesArray,
  WithSubordinationLevel,
  WithStrokeWidth,
} from '../../parts'
import AbstractShapeForm, { propTypes as abstractShapeFormPropTypes } from '../../parts/AbstractShapeForm'
import './lineForm.css'

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
    WithStrokeWidth,
  )(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  renderContent () {
    return (
      <div className="line-container">
        <div className="line-container__item">
          <div className="line-container__itemWidth">
            {this.renderSubordinationLevel()}
            {this.renderColor()}
            {this.renderStrokeWidth()}
            {this.renderSegment()}
            {this.renderLineType()}
          </div>
          <div className="line-container__itemWidth">
            {this.renderLineAmplifiers()}
            {this.renderLineNodes()}
            {this.renderLineEnds(DIRECTION_LEFT)}
            {this.renderLineEnds(DIRECTION_RIGHT)}
          </div>
        </div>
        {this.renderCoordinatesArray()}
      </div>
    )
  }
}
