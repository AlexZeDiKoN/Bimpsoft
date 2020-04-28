import React from 'react'
import { compose } from 'redux'
import { components } from '@DZVIN/CommonComponents'
import { Checkbox } from 'antd'
import i18n from '../../../../i18n'

import {
  UnitSelect,
  WithSubordinationLevel,
  WithAffiliation,
  WithStatus,
  WithColor,
  WithFill,
  WithLineType,
  WithStrokeWidth,
  WithHatch,
  WithIntermediateAmplifiers,
  WithPointAmplifiers,
  WithCoordinateAndWidth,
} from '../../parts'
import AbstractShapeForm, { propTypes as abstractShapeFormPropTypes } from '../../parts/AbstractShapeForm'
import './SquareForm.css'
import { NAME_OF_AMPLIFIERS } from '../../parts/WithIntermediateAmplifiers'

const { FormRow, FormDarkPart } = components.form
const SHOWN_INTERMEDIATE_AMPLIFIERS_PATH = [ 'attributes', 'shownIntermediateAmplifiers' ]

export default class SquareForm extends
  compose(
    UnitSelect,
    WithSubordinationLevel,
    WithAffiliation,
    WithStatus,
    WithLineType,
    WithStrokeWidth,
    WithColor,
    WithFill,
    WithHatch,
    WithIntermediateAmplifiers,
    WithPointAmplifiers,
    WithCoordinateAndWidth,
  )(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  setAmplifierShowerHandler = (path, index) => () => this.setResult((result) =>
    result.updateIn(path, (showedSet) =>
      showedSet.has(index) ? showedSet.delete(index) : showedSet.add(index),
    ),
  )

  renderContent () {
    const intermediateArray = [ i18n.AMP_LEFT, i18n.AMP_TOP, i18n.AMP_RIGHT, i18n.AMP_BOTTOM ]
    const canEdit = this.isCanEdit()
    const formStore = this.getResult()
    const shownIntermediateAmplifiersSet = formStore.getIn(SHOWN_INTERMEDIATE_AMPLIFIERS_PATH)
    return (
      <div className="square-container">
        <div className="square-container--firstSection">
          <div className="square-container__itemSchema">
            <img src={`${process.env.PUBLIC_URL}/images/schema-square-amplifiers.svg`} alt=""/>
          </div>
          <div className="square-container__itemWidth">
            {this.renderSubordinationLevel()}
            {this.renderOrgStructureSelect()}
          </div>
          <div className="square-container__itemWidth">
            {this.renderAffiliation()}
            {this.renderStatus()}
          </div>
        </div>
        <div className="square-container--secondSection">
          <div className="square-container__itemWidth">
            {this.renderLineType(true)}
            {this.renderStrokeWidth()}
            <FormRow label={i18n.LINE_COLOR}>
              {this.renderColor()}
            </FormRow>
          </div>
          <div className="square-container__itemWidth">
            {this.renderFill(true)}
            {this.renderHatch()}
          </div>
        </div>
        {this.renderIntermediateAmplifiers()}
        {this.renderPointAmplifiers()}
        <div className="square-container__item">
          <div className="square-container__itemWidth50">
            <FormDarkPart>
              <FormRow label={i18n.AMPLIFIERS_DISPLAY}>
              </FormRow>
              <table className="on_intermediate_table">
                {intermediateArray.map((name, index) => (
                  <tr key={index}>
                    <td>
                      {name}
                    </td>
                    <td>
                      <div className="icon-option">
                        <Checkbox
                          disabled={!canEdit}
                          name={NAME_OF_AMPLIFIERS}
                          onChange={this.setAmplifierShowerHandler(SHOWN_INTERMEDIATE_AMPLIFIERS_PATH, index)}
                          checked={shownIntermediateAmplifiersSet.has(index)}
                        />
                        <span>&nbsp;&laquo;{NAME_OF_AMPLIFIERS}&raquo;</span>
                      </div>
                    </td>
                  </tr>
                ))
                }
              </table>
            </FormDarkPart>
          </div>
          <div className="square-container__itemWidth50">
            {this.renderCoordinateAndWidth()}
          </div>
        </div>
      </div>
    )
  }
}
