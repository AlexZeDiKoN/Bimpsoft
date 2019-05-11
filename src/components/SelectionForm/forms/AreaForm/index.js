import React from 'react'
import { compose } from 'redux'
import {
  WithColor,
  WithFill,
  WithSegment,
  WithLineType,
  WithLineAmplifiers,
  WithLineNodes,
  WithCoordinatesArray,
  WithSubordinationLevel,
  WithStrokeWidth,
} from '../../parts'
import AbstractShapeForm, { propTypes as abstractShapeFormPropTypes } from '../../parts/AbstractShapeForm'
import './areaForm.css'

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
  static propTypes = abstractShapeFormPropTypes

  renderContent () {
    return (
      <div className="area-container">
        <div className="area-container__item">
          <div className="area-container__itemWidth">
            {this.renderSubordinationLevel()}
            {this.renderColor()}
            {this.renderStrokeWidth()}
            {this.renderFill()}
          </div>
          <div className="area-container__itemWidth">
            {this.renderSegment()}
            {this.renderLineType()}
            {this.renderLineAmplifiers()}
            {this.renderLineNodes()}
          </div>
        </div>
        {this.renderCoordinatesArray()}
      </div>
    )
  }
}
