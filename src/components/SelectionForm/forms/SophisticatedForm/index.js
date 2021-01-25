import { compose } from 'redux'
import React from 'react'
import { components } from '@C4/CommonComponents'
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
import { extractLineCode } from '../../../WebMap/patch/Sophisticated/utils'
import SelectionTacticalSymbol from '../../parts/SelectionTacticalSymbol'
import { PROPERTY_PATH } from '../../../../constants/propertyPath'

const { FormDarkPart } = components.form

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

  onChangeSymbol = (data) => {
    if (!data) {
      return
    }
    const { code, amp = {} } = JSON.parse(data)
    if (!code) {
      // return
    }
    // console.log('soph', data)
  }

  renderContent () {
    const useStatus = lineDefinitions[extractLineCode(this.props.data.code)]?.useStatus
    const useAmplifiers = lineDefinitions[extractLineCode(this.props.data.code)]?.useAmplifiers
    const result = this.getResult()
    const type = result.getIn(PROPERTY_PATH.TYPE)
    const attributes = result.getIn(PROPERTY_PATH.ATTRIBUTES).toJS()
    const code = result.getIn(PROPERTY_PATH.CODE)
    return (
      <div className="sophisticated-container">
        <div className='scroll-container'>
          <SelectionTacticalSymbol
            code={code}
            type={type}
            attributes={attributes}
            onChange={this.onChangeSymbol}
          />
          <div className="sophisticated-container__item--firstSection">
            <div className="sophisticated-container__itemWidth-right">
              {this.renderSubordinationLevel()}
              {this.renderOrgStructureSelect()}
              {this.renderAffiliation()}
              {useStatus && this.renderStatus()}
            </div>
          </div>
          <div className="sophisticated-container__item--secondSection">
            <div className="sophisticated-container__itemWidth">
              <div className='containerTypeColor'>
                {this.renderStrokeWidth()}
                {this.renderColor()}
              </div>
            </div>
            {useAmplifiers && this.renderAmplifiers(useAmplifiers)}
            <div className="sophisticated-container__item">
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
