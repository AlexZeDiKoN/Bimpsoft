import React from 'react'
import { compose } from 'redux'
import {
  WithColor,
  WithFill,
  WithSegment,
  WithLineType,
  WithHatch,
  WithNodalPointType,
  WithCoordinatesArray,
  WithSubordinationLevel,
  WithIntermediateAmplifiers,
  WithPointAmplifiers,
  WithStrokeWidth,
  UnitSelect,
} from '../../parts'
import AbstractShapeForm, { propTypes as abstractShapeFormPropTypes } from '../../parts/AbstractShapeForm'
import './areaForm.css'

const Extenders = compose(
  WithSubordinationLevel,
  WithCoordinatesArray,
  WithLineType,
  WithNodalPointType,
  WithSegment,
  WithFill,
  WithHatch,
  WithColor,
  WithStrokeWidth,
  WithIntermediateAmplifiers,
  WithPointAmplifiers,
  UnitSelect,
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
            {/*{this.renderHatch()}*/}
          </div>
          <div className="area-container__itemWidth">
            {this.renderOrgStructureSelect()}
            {this.renderSegment()}
            {this.renderLineType()}
            {this.renderNodalPointType()}
          </div>
        </div>
        {this.renderIntermediateAmplifiers()}
        {this.renderPointAmplifiers()}
        {this.renderCoordinatesArray()}
      </div>
    )
  }
}
