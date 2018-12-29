import React, { Fragment } from 'react'
import { compose } from 'redux'
import {
  AbstractShapeForm,
  WithTexts,
  WithSubordinationLevel,
} from '../parts'

export default class TextForm extends
  compose(WithSubordinationLevel, WithTexts)(AbstractShapeForm) {
    static propTypes = AbstractShapeForm.propTypes

    renderContent () {
      return (
        <Fragment>
          {this.renderSubordinationLevel()}
          {this.renderTexts()}
        </Fragment>
      )
    }
}
