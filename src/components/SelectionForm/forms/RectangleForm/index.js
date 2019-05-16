import React from 'react'
import { compose } from 'redux'
import {
  WithColor,
  WithFill,
  WithLineType,
  WithTwoCoordinates,
  WithSubordinationLevel,
  WithStrokeWidth,
  UnitSelect,
} from '../../parts'
import AbstractShapeForm, { propTypes as abstractShapeFormPropTypes } from '../../parts/AbstractShapeForm'
import './RectangleForm.css'

export default class RectangleForm extends
  compose(
    WithSubordinationLevel,
    WithTwoCoordinates,
    WithColor,
    WithFill,
    WithLineType,
    WithStrokeWidth,
    UnitSelect,
  )(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  renderContent () {
    return (
      <div className="rectangle-container">
        <div className="rectangle-container__item">
          <div className="rectangle-container__itemWidth">
            {this.renderSubordinationLevel()}
            {this.renderOrgStructureSelect()}
            {this.renderStrokeWidth()}
          </div>
          <div className="rectangle-container__itemWidth">
            {this.renderColor()}
            {this.renderFill()}
            {this.renderLineType(true)}
          </div>
        </div>
        {this.renderTwoCoordinates()}
      </div>
    )
  }
}
