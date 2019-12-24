import React from 'react'
import { Select } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import { colors } from '../../../constants'
import * as WithLineType from './WithLineType'
import * as WithColor from './WithColor'
import * as WithLineEnds from './WithLineEnds'

const { FormRow } = components.form

const CLASSIFIERS = {
  0: {
    id: 0,
    text: i18n.UNDEFINED,
    attributes: [],
  },
  1: {
    id: 1,
    text: i18n.DIVIDING_LINE,
    attributes: [
      { path: WithLineType.PATH, value: WithLineType.types.solid.value },
      { path: WithColor.PATH, value: colors.RED },
      { path: WithLineEnds.PATHS[WithLineEnds.DIRECTION_LEFT], value: 'none' },
      { path: WithLineEnds.PATHS[WithLineEnds.DIRECTION_RIGHT], value: 'none' },
    ],
  },
}

export const PATH = [ 'attributes', 'lineClassifier' ]

const WithLineClassifier = (Component) => class LineClassifierComponent extends Component {
  lineClassifierHandler = (id) => this.setResult((result) => {
    result = result.setIn(PATH, id)
    return CLASSIFIERS[id].attributes.reduce((acc, attr) => (
      acc.setIn(attr.path, attr.value)
    ), result)
  })

  renderLineClassifier () {
    const currentClassifier = this.getResult().getIn(PATH)
    const canEdit = this.isCanEdit()
    return (
      <FormRow label={i18n.NATO_CLASSIFIER}>
        <Select value={currentClassifier} onChange={this.lineClassifierHandler} disabled={!canEdit}>
          {Object.values(CLASSIFIERS).map(({ id, text }) => (
            <Select.Option key={id} value={id}>{text}</Select.Option>
          ))}
        </Select>
      </FormRow>
    )
  }
}

export default WithLineClassifier
