import React from 'react'
import { Select } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import { nodesDiv, nodesOption } from './render'

const { FormRow } = components.form

export const types = {
  none: { text: i18n.NO_ONE, value: 'none' },
  crossCircle: { text: i18n.SHAPE_CIRCLE, value: 'cross-circle' },
  square: { text: i18n.SHAPE_SQUARE, value: 'square' },
}

export const PATH = [ 'attributes', 'nodalPointType' ]

const WithNodalPointType = (Component) => class NodalPointTypeComponent extends Component {
  nodalPointTypeHandler = (lineNodes) => this.setResult((result) => result.setIn(PATH, lineNodes))

  renderNodalPointType () {
    const currentValue = this.getResult().getIn(PATH)
    const typeInfo = types[currentValue]
    const canEdit = this.isCanEdit()

    const value = canEdit
      ? (
        <Select value={currentValue} onChange={this.nodalPointTypeHandler}>
          {Object.values(types).map((type) => nodesOption(type))}
        </Select>
      )
      : nodesDiv(typeInfo)

    return (
      <FormRow label={i18n.LINE_NODES}>
        {value}
      </FormRow>
    )
  }
}

export default WithNodalPointType
