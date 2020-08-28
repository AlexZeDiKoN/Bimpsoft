import { compose } from 'redux'
import React from 'react'
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
import { TYPE_AMPLIFIER_INTEGER, TYPE_AMPLIFIER_TEXT } from '../../parts/WithAmplifiers'

const CONFIG_AMPLIFIERS = [
  { id: 'directions', name: i18n.AMP_LANES_NUMBER, type: TYPE_AMPLIFIER_INTEGER, maxNumber: 99, notTitle: true },
  { id: 'zones', name: i18n.AMP_ZONES_NUMBER, type: TYPE_AMPLIFIER_INTEGER, maxNumber: 99, notTitle: true },
  { id: 'start', name: i18n.AMP_STARTING_NUMBER, type: TYPE_AMPLIFIER_INTEGER, maxNumber: 999999, notTitle: true },
  { id: 'title', name: i18n.AMP_TITLE, type: TYPE_AMPLIFIER_TEXT, maxRows: 1 },
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
      <div className="strip-default-container">
        <div className='scroll-container'>
          <div className="strip-default-container__item--firstSection">
            <div className="strip-default-container__itemWidth-right">
              {this.renderSubordinationLevel()}
              {this.renderOrgStructureSelect()}
              {this.renderAffiliation()}
              {this.renderStatus()}
            </div>
          </div>
          <div className="strip-default-container__item--secondSection">
            <div className="strip-default-container__itemWidth">
              <div className='containerTypeColor'>
                {this.renderStrokeWidth()}
                {this.renderColor()}
              </div>
            </div>
            {this.renderAmplifiers(CONFIG_AMPLIFIERS, PATH_AMPLIFIERS, true)}
          </div>
        </div>
      </div>
    )
  }
}
