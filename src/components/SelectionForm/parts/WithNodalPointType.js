import React from 'react'
import { Select } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import { nodesDiv, nodesOption } from './render'

const { FormRow } = components.form

export const NODAL_POINT_TYPES = {
  'none': { text: i18n.NO_ONE, value: 'none' },
  'cross-circle': { text: i18n.SHAPE_CIRCLE, value: 'cross-circle' },
  'square': { text: i18n.SHAPE_SQUARE, value: 'square' },
}

export const NODAL_POINT_TYPE_PATH = [ 'attributes', 'nodalPointType' ]

const WithNodalPointType = (Component) => class NodalPointTypeComponent extends Component {
  nodalPointTypeHandler = (nodalPointType) => (
    this.setResult((result) => result.setIn(NODAL_POINT_TYPE_PATH, nodalPointType))
  )

  renderNodalPointType () {
    const currentValue = this.getResult().getIn(NODAL_POINT_TYPE_PATH)
    const typeInfo = NODAL_POINT_TYPES[currentValue]
    const canEdit = this.isCanEdit()

    const value = canEdit
      ? (
        <Select value={currentValue} onChange={this.nodalPointTypeHandler}>
          {Object.values(NODAL_POINT_TYPES).map((type) => nodesOption(type))}
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
