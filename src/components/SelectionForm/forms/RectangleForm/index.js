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
  WithIntermediateAmplifiersTune,
  WithTwoCoordinates,
} from '../../parts'
import AbstractShapeForm, { propTypes as abstractShapeFormPropTypes } from '../../parts/AbstractShapeForm'
import './RectangleForm.css'

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
    WithIntermediateAmplifiersTune,
    WithTwoCoordinates,
  )(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  renderContent () {
    return (
      <div className="rectangle-container">
        <div className="rectangle-container--firstSection">
          <div className="rectangle-container__itemSchema">
            <img src={`${process.env.PUBLIC_URL}/images/schema-square-amplifiers.svg`} alt=""/>
          </div>
          <div className="rectangle-container__itemWidth">
            {this.renderSubordinationLevel()}
            {this.renderOrgStructureSelect()}
          </div>
          <div className="rectangle-container__itemWidth">
            {this.renderAffiliation()}
            {this.renderStatus()}
          </div>
        </div>
        <div className="rectangle-container--secondSection">
          <div className="rectangle-container__itemWidth">
            {this.renderLineType(true)}
            {this.renderStrokeWidth()}
            <FormRow label={i18n.LINE_COLOR}>
              {this.renderColor()}
            </FormRow>
          </div>
          <div className="rectangle-container__itemWidth">
            {this.renderFill(true)}
            {this.renderHatch()}
          </div>
        </div>
        {this.renderIntermediateAmplifiers()}
        {this.renderPointAmplifiers()}
        <div className="rectangle-container__item">
          <div className="rectangle-container__itemWidth50">
            <FormDarkPart>
              <FormRow label={i18n.AMPLIFIERS_DISPLAY}>
              </FormRow>
              {this.renderIntermediateAmplifiersTune()}
            </FormDarkPart>
          </div>
          <div className="rectangle-container__itemWidth50">
            {this.renderTwoCoordinates()}
          </div>
        </div>
      </div>
    )
  }
}
