import { compose } from 'redux'
import React from 'react'
import { Scrollbar } from '@C4/CommonComponents'
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
    const elem = <div className="containers-svg-tooltip">
      <img src={`${process.env.PUBLIC_URL}/images/schema-line-amplifiers.svg`} alt=""/>
    </div>
    return (
      <Scrollbar>
        <div className="line-container">
          <div className='scroll-container'>
            <div className="line-container__item--firstSection">
              <div className="line-container__itemWidth-right">
                {this.renderSubordinationLevel()}
                {this.renderOrgStructureSelect()}
                {this.renderAffiliation()}
                {this.renderStatus()}
              </div>
            </div>
            <div className="line-container__item--secondSection">
              <div className="line-container__itemWidth">
                <div className='containerTypeColor'>
                  {this.renderSegment()}
                  {this.renderColor()}
                </div>
                {this.renderLineType()}
                <div className='container-sections'>
                  {this.renderStrokeWidth()}
                  {this.renderNodalPointType()}
                  {this.renderLineEnds(DIRECTION_LEFT)}
                  {this.renderLineEnds(DIRECTION_RIGHT)}
                </div>
              </div>
            </div>
            {this.renderIntermediateAmplifiers(elem)}
            {this.renderPointAmplifiers(elem)}
            {this.renderCoordinatesArray(false)}
          </div>
        </div>
      </Scrollbar>
    )
  }
}
