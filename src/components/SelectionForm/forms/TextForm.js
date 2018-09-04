import React, { Fragment } from 'react'
import { compose } from 'redux'
import {
  AbstractShapeForm,
  WithTexts,
  WithSubordinationLevel,
} from '../parts/index'

export default class LineForm extends
  compose(WithSubordinationLevel, WithTexts)(AbstractShapeForm) {
  static propTypes = {
    ...AbstractShapeForm.propTypes,
    ...WithTexts.propTypes,
    ...WithSubordinationLevel.propTypes,
  }

  renderContent () {
    return (
      <Fragment>
        {this.renderSubordinationLevel()}
        {this.renderTexts()}
      </Fragment>
    )
  }
}
