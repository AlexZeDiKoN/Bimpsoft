import { compose } from 'redux'
import React from 'react'
import { DIRECTION_LEFT, DIRECTION_RIGHT } from '../../parts/WithLineEnds'
import {
  WithColor,
  WithSegment,
  WithLineType,
  WithNodalPointType,
  WithPointAmplifiers,
  WithIntermediateAmplifiers,
  WithLineEnds,
  WithCoordinatesArray,
  WithSubordinationLevel,
  WithStrokeWidth,
  UnitSelect,
  WithLineClassifier,
  WithAffiliation,
} from '../../parts'
import AbstractShapeForm, { propTypes as abstractShapeFormPropTypes } from '../../parts/AbstractShapeForm'
import './LineForm.css'
import WithStatus from '../../parts/WithStatus'

export default class LineForm extends compose(
  WithSubordinationLevel,
  WithCoordinatesArray,
  WithLineType,
  WithNodalPointType,
  WithPointAmplifiers,
  WithIntermediateAmplifiers,
  WithLineEnds,
  WithSegment,
  WithColor,
  WithStrokeWidth,
  UnitSelect,
  WithLineClassifier,
  WithAffiliation,
  WithStatus,
)(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  renderContent () {
    return (
      <div className="line-container">
        <div className="line-container__item">
          {/* TODO: Add line preview */}
          <div className="line-container__itemWidth"/>
          <div className="line-container__itemWidth">
            {this.renderLineClassifier()}
            {this.renderOrgStructureSelect()}
            {this.renderSubordinationLevel()}
            {this.renderAffiliation()}
            {this.renderStatus()}
          </div>
        </div>
        <div className="line-container__item">
          <div className="line-container__itemWidth">
            {this.renderSegment()}
            {this.renderLineType()}
            {this.renderNodalPointType()}
          </div>
          <div className="line-container__itemWidth">
            {this.renderColor()}
            {this.renderStrokeWidth()}
          </div>
          <div className="line-container__itemWidth">
            {this.renderLineEnds(DIRECTION_LEFT)}
            {this.renderLineEnds(DIRECTION_RIGHT)}
          </div>
        </div>
        {this.renderIntermediateAmplifiers()}
        {this.renderPointAmplifiers()}
        {this.renderCoordinatesArray()}
      </div>
    )
  }
}
