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
  WithTwoCoordinates,
  WithCatalogsFields,
} from '../../parts'
import AbstractShapeForm, { propTypes as abstractShapeFormPropTypes } from '../../parts/AbstractShapeForm'
import './RectangleForm.css'
import SelectionTacticalSymbol from '../../parts/SelectionTacticalSymbol'
import { PROPERTY_PATH as PATH } from '../../../../constants/propertyPath'

const { FormDarkPart } = components.form

class RectangleForm extends
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
    WithTwoCoordinates,
  )(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  renderContent () {
    const elem = <div className="containers-svg-tooltip">
      <img src={`${process.env.PUBLIC_URL}/images/schema-square-amplifiers.svg`} alt=""/>
    </div>
    const result = this.getResult()
    return (
      <div className="rectangle-container">
        <div className='scroll-container'>
          <SelectionTacticalSymbol
            code={result.getIn(PATH.CODE)}
            type={result.getIn(PATH.TYPE)}
            attributes={result.getIn(PATH.ATTRIBUTES).toJS()}
            onChange={this.onChangeTacticalSymbol}
          />
          <div className="rectangle-container__item--firstSection">
            <div className="rectangle-container__itemWidth-right">
              {this.renderSubordinationLevel()}
              {this.renderOrgStructureSelect()}
              {this.renderAffiliation()}
              {this.renderStatus()}
            </div>
          </div>
          <div className="rectangle-container__item--secondSection">
            <div className="rectangle-container__itemWidth">
              <div className='containerTypeColor'>
                {this.renderLineType(true)}
                {this.renderColor()}
              </div>
              {this.renderStrokeWidth()}
            </div>
            <div className="rectangle-container__itemWidth">
              {this.renderFill(true)}
            </div>
          </div>
          {this.renderIntermediateAmplifiers(elem)}
          {this.renderPointAmplifiers(elem)}
          <div className="rectangle-container__item">
            <div className="rectangle-container__itemWidth50">
              <FormDarkPart>
                <div className='amplifiers-display'>
                  {i18n.AMPLIFIERS_DISPLAY}
                </div>
                {this.renderIntermediateAmplifiersTune()}
              </FormDarkPart>
            </div>
            <div className="rectangle-container__itemWidth50">
              {this.renderTwoCoordinates(true)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const SquareFormWithDecorator = WithCatalogsFields(RectangleForm)

export default SquareFormWithDecorator
