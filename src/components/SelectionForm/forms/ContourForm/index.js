import { compose } from 'redux'
import React from 'react'
import AbstractShapeForm, {
  propTypes as abstractShapeFormPropTypes,
} from '../../parts/AbstractShapeForm'
import {
  WithColor,
  WithFill,
  WithSubordinationLevel,
  WithStrokeWidth,
  UnitSelect,
} from '../../parts'

import './ContourForm.css'

export default class ContourForm extends compose(
  WithColor,
  WithFill,
  WithSubordinationLevel,
  WithStrokeWidth,
  UnitSelect,
)(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  renderContent () {
    return (
      <div className="contour-container">
        <div className="contour-container__item">
          <div className="contour-container__itemWidth">
            {this.renderSubordinationLevel()}
            {this.renderOrgStructureSelect()}
            {this.renderStrokeWidth()}
          </div>
          <div className="contour-container__itemWidth">
            {this.renderColor()}
            {this.renderFill()}
          </div>
        </div>
      </div>
    )
  }
}
