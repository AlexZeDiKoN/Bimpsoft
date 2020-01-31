import { compose } from 'redux'
import React from 'react'
import { Scrollbar } from '@DZVIN/CommonComponents'
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
      <Scrollbar>
        <div className="line-container">
          <div className="line-container__item--firstSection">
            <div className="line-container__itemWidth-left">
              <img src={`${process.env.PUBLIC_URL}/images/schema-line-amplifiers.svg`} alt=""/>
            </div>
            <div className="line-container__itemWidth-right">
              {this.renderLineClassifier()}
              <div className='line-container__itemWidth--section1'>
                <div>
                  {this.renderOrgStructureSelect()}
                  {this.renderSubordinationLevel()}
                </div>
                <div>
                  {this.renderAffiliation()}
                  {this.renderStatus()}
                </div>
              </div>
            </div>
          </div>
          <div className="line-container__item--secondSection">
            <div className="line-container__itemWidth">
              <div>
                {this.renderSegment()}
                {this.renderLineEnds(DIRECTION_LEFT)}
                {this.renderNodalPointType()}
              </div>
              <div>
                <div className='containerTypeColor'>
                  {this.renderLineType()}
                  {this.renderColor()}
                </div>
                {this.renderStrokeWidth()}
                {this.renderLineEnds(DIRECTION_RIGHT)}
              </div>
            </div>
          </div>
          {this.renderIntermediateAmplifiers()}
          {this.renderPointAmplifiers()}
          {this.renderCoordinatesArray()}
        </div>
      </Scrollbar>
    )
  }
}
