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

import './SophisticatedForm.css'
import i18n from '../../../../i18n'
import { extractLineCode } from '../../../WebMap/patch/Sophisticated/utils'

const { FormRow, FormDarkPart } = components.form

export default class SophisticatedForm extends compose(
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
      <div className="contour-container">
        <div className="contour-container--firstSection">
          <div className="contour-container__item">
            <div className="contour-container__itemWidth">
              {this.renderSubordinationLevel()}
              {this.renderOrgStructureSelect()}
            </div>
            <div className="contour-container__itemWidth">
              {this.renderAffiliation()}
              {useStatus && this.renderStatus()}
            </div>
          </div>
        </div>
        <div className="contour-container--secondSection">
          <div className="contour-container__item">
            {this.renderStrokeWidth()}
            <FormRow label={i18n.LINE_COLOR}>
              {this.renderColor()}
            </FormRow>
          </div>
          {useAmplifiers && this.renderAmplifiers(useAmplifiers)}
          <div className="contour-container__item">
            <FormDarkPart>
              {this.renderCoordinates()}
            </FormDarkPart>
          </div>
        </div>
      </div>
    )
  }
}
