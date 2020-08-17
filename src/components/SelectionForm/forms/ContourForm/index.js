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
      <div className="contour-default-container">
        <div className='scroll-container'>
          <div className="contour-default-container__item--firstSection">
            <div className="contour-default-container__itemWidth-right">
              {this.renderSubordinationLevel()}
              {this.renderOrgStructureSelect()}
              {this.renderStrokeWidth()}
            </div>
          </div>
          <div className='contour-default-container__item--secondSection'>
            <div className="contour-default-container__itemWidth">
              <div className='containerTypeColor'>
                {this.renderColor(true)}
                {this.renderFill()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
