import React from 'react'
import { compose } from 'redux'
import {
  WithTexts,
  WithSubordinationLevel,
  UnitSelect,
} from '../../parts'
import AbstractShapeForm, { propTypes as abstractShapeFormPropTypes } from '../../parts/AbstractShapeForm'

export default class TextForm extends
  compose(
    WithSubordinationLevel,
    WithTexts,
    UnitSelect,
  )(AbstractShapeForm) {
    static propTypes = abstractShapeFormPropTypes

    renderContent () {
      return (
        <>
          {this.renderSubordinationLevel()}
          {this.renderOrgStructureSelect()}
          {this.renderTexts()}
        </>
      )
    }
}
