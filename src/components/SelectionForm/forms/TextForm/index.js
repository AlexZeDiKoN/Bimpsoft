import React from 'react'
import { compose } from 'redux'
import {
  WithTexts,
  WithSubordinationLevel,
  UnitSelect,
} from '../../parts'
import AbstractShapeForm, { propTypes as abstractShapeFormPropTypes } from '../../parts/AbstractShapeForm'
import './TextMarker.css'

export default class TextForm extends
  compose(
    WithSubordinationLevel,
    WithTexts,
    UnitSelect,
  )(AbstractShapeForm) {
    static propTypes = abstractShapeFormPropTypes

    renderContent () {
      return (
        <div className="textMarker-container">
          <div className="textMarker-container__item">
            <div className="subordination-level">
              {this.renderSubordinationLevel()}
            </div>
            {this.renderOrgStructureSelect()}
          </div>
          {this.renderTexts()}
        </div>
      )
    }
}
