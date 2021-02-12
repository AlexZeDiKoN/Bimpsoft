import React from 'react'
import { compose } from 'redux'
import { components } from '@C4/CommonComponents'
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
  WithIntermediateAmplifiers,
  WithPointAmplifiers,
  WithIntermediateAmplifiersTune,
  WithCoordinateAndWidth,
  WithCatalogsFields,
} from '../../parts'
import AbstractShapeForm, { propTypes as abstractShapeFormPropTypes } from '../../parts/AbstractShapeForm'
import './SquareForm.css'

const { FormDarkPart } = components.form

class SquareForm extends
  compose(
    UnitSelect,
    WithSubordinationLevel,
    WithAffiliation,
    WithStatus,
    WithLineType,
    WithStrokeWidth,
    WithColor,
    WithFill,
    WithIntermediateAmplifiers,
    WithPointAmplifiers,
    WithIntermediateAmplifiersTune,
    WithCoordinateAndWidth,
  )(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  renderContent () {
    const elem = <div className="containers-svg-tooltip">
      <img src={`${process.env.PUBLIC_URL}/images/schema-square-amplifiers.svg`} alt=""/>
    </div>
    return (
      <div className="square-container">
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
            </div>
          </div>
          {this.renderIntermediateAmplifiers(elem)}
          {this.renderPointAmplifiers(elem)}
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
              {this.renderCoordinateAndWidth(true)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const SquareFormWithDecorator = WithCatalogsFields(SquareForm)

export default SquareFormWithDecorator
