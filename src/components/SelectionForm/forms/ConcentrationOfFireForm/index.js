import { compose } from 'redux'
import React from 'react'
import { components } from '@DZVIN/CommonComponents'
import lineDefinitions from '../../../WebMap/patch/Sophisticated/lineDefinitions'
import AbstractShapeForm, {
  propTypes as abstractShapeFormPropTypes,
} from '../../parts/AbstractShapeForm'

import {
  UnitSelect,
  WithSubordinationLevel,
  WithAffiliation,
  WithStatus,
  WithStrokeWidth,
  WithColor,
  WithAmplifiers,
  WithCoordinates,
} from '../../parts'

import './ConcentrationOfFireForm.css'
import { extractLineCode } from '../../../WebMap/patch/Sophisticated/utils'

const { FormDarkPart } = components.form

export default class ConcentrationOfFireForm extends compose(
  UnitSelect,
  WithSubordinationLevel,
  WithAffiliation,
  WithStatus,
  WithStrokeWidth,
  WithColor,
  WithAmplifiers,
  WithCoordinates,
)(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  renderContent () {
    const useStatus = lineDefinitions[extractLineCode(this.props.data.code)]?.useStatus
    const useAmplifiers = lineDefinitions[extractLineCode(this.props.data.code)]?.useAmplifiers
    return (
      <div className="concentration-container">
        <div className='scroll-container'>
          <div className="concentration-container__item--firstSection">
            <div className="concentration-container__itemWidth-right">
              {this.renderSubordinationLevel()}
              {this.renderOrgStructureSelect()}
              {this.renderAffiliation()}
              {useStatus && this.renderStatus()}
            </div>
          </div>
          <div className="concentration-container__item--secondSection">
            <div className="concentration-container__itemWidth">
              <div className='containerTypeColor'>
                {this.renderStrokeWidth()}
                {this.renderColor()}
              </div>
            </div>
            {useAmplifiers && this.renderAmplifiers(useAmplifiers)}
            <div className="concentration-container__item">
              <FormDarkPart>
                {this.renderCoordinates()}
              </FormDarkPart>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
