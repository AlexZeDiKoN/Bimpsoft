import { compose } from 'redux'
import React from 'react'
import { components } from '@DZVIN/CommonComponents'
import AbstractShapeForm, {
  propTypes as abstractShapeFormPropTypes,
} from '../../parts/AbstractShapeForm'

import {
  UnitSelect,
  WithSubordinationLevel,
  WithAffiliation,
  WithStrokeWidth,
  WithColor,
  WithCoordinates,
} from '../../parts'

import './SophisticatedForm.css'
import i18n from '../../../../i18n'

const { FormRow, FormDarkPart, FormDivider } = components.form

export default class SophisticatedForm extends compose(
  UnitSelect,
  WithSubordinationLevel,
  WithAffiliation,
  WithStrokeWidth,
  WithColor,
  WithCoordinates,
)(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  renderContent () {
    return (
      <div className="contour-container">
        <div className="contour-container__item">
          <div className="contour-container__itemWidth">
            {this.renderSubordinationLevel()}
            {this.renderOrgStructureSelect()}
          </div>
          <div className="contour-container__itemWidth">
            {this.renderAffiliation()}
          </div>
        </div>
        <div className="contour-container--secondSection">
          <div className="contour-container__item">
            {this.renderStrokeWidth()}
            <FormRow label={i18n.LINE_COLOR}>
              {this.renderColor()}
            </FormRow>
          </div>
          <div className="contour-container__item">
            {<FormDivider/>}
            <FormDarkPart>
              {this.renderCoordinates()}
            </FormDarkPart>
          </div>
        </div>
      </div>
    )
  }
}
