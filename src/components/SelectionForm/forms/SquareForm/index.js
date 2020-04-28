import React from 'react'
import { compose } from 'redux'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../../i18n'

import {
  UnitSelect,
  WithSubordinationLevel,
  WithAffiliation,
  WithStatus,
  WithColor,
  WithFill,
  WithLineType,
  WithStrokeWidth,
  WithHatch,
  WithIntermediateAmplifiers,
  WithPointAmplifiers,
  WithCoordinateAndWidth,
} from '../../parts'
import AbstractShapeForm, { propTypes as abstractShapeFormPropTypes } from '../../parts/AbstractShapeForm'
import './SquareForm.css'

const { FormRow, FormDarkPart } = components.form

export default class SquareForm extends
  compose(
    UnitSelect,
    WithSubordinationLevel,
    WithAffiliation,
    WithStatus,
    WithLineType,
    WithStrokeWidth,
    WithColor,
    WithFill,
    WithHatch,
    WithIntermediateAmplifiers,
    WithPointAmplifiers,
    WithCoordinateAndWidth,
  )(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  renderContent () {
    return (
      <div className="square-container">
        <div className="square-container--firstSection">
          <div className="square-container__itemSchema">
            <img src={`${process.env.PUBLIC_URL}/images/schema-square-amplifiers.svg`} alt=""/>
          </div>
          <div className="square-container__itemWidth">
            {this.renderSubordinationLevel()}
            {this.renderOrgStructureSelect()}
          </div>
          <div className="square-container__itemWidth">
            {this.renderAffiliation()}
            {this.renderStatus()}
          </div>
        </div>
        <div className="square-container--secondSection">
          <div className="square-container__itemWidth">
            {this.renderLineType(true)}
            {this.renderStrokeWidth()}
            <FormRow label={i18n.LINE_COLOR}>
              {this.renderColor()}
            </FormRow>
          </div>
          <div className="square-container__itemWidth">
            {this.renderFill(true)}
            {this.renderHatch()}
          </div>
        </div>
        {this.renderIntermediateAmplifiers()}
        {this.renderPointAmplifiers()}
        <div className="square-container__item">
          <div className="square-container__itemWidth50">
            <FormDarkPart>
              <span>Амплификаторы</span>
            </FormDarkPart>
          </div>
          <div className="square-container__itemWidth50">
            {this.renderCoordinateAndWidth()}
          </div>
        </div>
      </div>
    )
  }
}
