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
  WithStatus,
  WithStrokeWidth,
  WithColor,
  WithAmplifiers,
  WithCoordinates,
} from '../../parts'

import './DefeatStripForm.css'
import i18n from '../../../../i18n'
import { TYPE_AMPLIFIER_NUM, TYPE_AMPLIFIER_TEXT } from '../../parts/WithAmplifiers'

const { FormRow } = components.form

const CONFIG_AMPLIFIERS = [
  { id: 'directions', name: i18n.AMP_LANES_NUMBER, type: TYPE_AMPLIFIER_NUM },
  { id: 'zones', name: i18n.AMP_ZONES_NUMBER, type: TYPE_AMPLIFIER_NUM },
  { id: 'start', name: i18n.AMP_STARTING_NUMBER, type: TYPE_AMPLIFIER_NUM },
  { id: 'title', name: i18n.AMP_TITLE, type: TYPE_AMPLIFIER_TEXT },
]

const PATH_AMPLIFIERS = [ 'attributes', 'params' ]

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
              {this.renderStatus()}
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
          {this.renderAmplifiers(CONFIG_AMPLIFIERS, PATH_AMPLIFIERS, true)}
        </div>
      </div>
    )
  }
}
