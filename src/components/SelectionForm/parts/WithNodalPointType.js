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

export const NODAL_POINT_ICON_PATH = [ 'attributes', 'nodalPointIcon' ]

const NODAL_POINT_ICON_OPTION_JSX = Object.values(NODAL_POINT_TYPES).map(nodesOption)

const WithNodalPointType = (Component) => class NodalPointTypeComponent extends Component {
  nodalPointIconHandler = (nodalPointIcon) => (
    this.setResult((result) => result.setIn(NODAL_POINT_ICON_PATH, nodalPointIcon))
  )

  renderNodalPointType () {
    const currentValue = this.getResult().getIn(NODAL_POINT_ICON_PATH)
    const typeInfo = NODAL_POINT_TYPES[currentValue]
    const canEdit = this.isCanEdit()

    const value = canEdit
      ? (
        <Select value={currentValue} onChange={this.nodalPointIconHandler}>
          {NODAL_POINT_ICON_OPTION_JSX}
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
