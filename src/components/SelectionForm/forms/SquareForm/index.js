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
  WithCoordinateAndWidth,
} from '../../parts'
import AbstractShapeForm, { propTypes as abstractShapeFormPropTypes } from '../../parts/AbstractShapeForm'
import './SquareForm.css'

const { FormDarkPart } = components.form

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
    WithCoordinateAndWidth,
  )(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  renderContent () {
    return (
      <div className="square-container">
        <div className="square-container__itemWidth-left">
          <img src={`${process.env.PUBLIC_URL}/images/schema-square-amplifiers.svg`} alt=""/>
        </div>
        <div className='scroll-container'>
          <div className="square-container__item--firstSection">
            <div className="square-container__itemWidth-right">
              {this.renderSubordinationLevel()}
              {this.renderOrgStructureSelect()}
              {this.renderAffiliation()}
              {this.renderStatus()}
            </div>
          </div>
          <div className="square-container__item--secondSection">
            <div className="square-container__itemWidth">
              <div className='containerTypeColor'>
                {this.renderLineType(true)}
                {this.renderColor()}
              </div>
              {this.renderStrokeWidth()}
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
                <div className='amplifiers-display'>
                  {i18n.AMPLIFIERS_DISPLAY}
                </div>
                {this.renderIntermediateAmplifiersTune()}
              </FormDarkPart>
            </div>
            <div className="square-container__itemWidth50">
              {this.renderCoordinateAndWidth()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
