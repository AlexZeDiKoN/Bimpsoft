import React from 'react'
import { Select } from 'antd'
import { components } from '@C4/CommonComponents'
import i18n from '../../../i18n'
import { nodesDiv, nodesOption } from './render'

const { FormRow } = components.form

export const NODAL_POINT_ICONS = {
  NONE: 'none',
  CROSS_CIRCLE: 'cross-circle',
  SQUARE: 'square',
}

const NODAL_POINT_ICON_DICTIONARY = {
  [NODAL_POINT_ICONS.NONE]: { text: i18n.NO_ONE, value: NODAL_POINT_ICONS.NONE },
  [NODAL_POINT_ICONS.CROSS_CIRCLE]: { text: i18n.SHAPE_CIRCLE, value: NODAL_POINT_ICONS.CROSS_CIRCLE },
  [NODAL_POINT_ICONS.SQUARE]: { text: i18n.SHAPE_SQUARE, value: NODAL_POINT_ICONS.SQUARE }
}

export const NODAL_POINT_ICON_PATH = [ 'attributes', 'nodalPointIcon' ]

const NODAL_POINT_ICON_OPTION_JSX = Object.values(NODAL_POINT_ICON_DICTIONARY).map(nodesOption)

const WithNodalPointType = (Component) => class NodalPointTypeComponent extends Component {
  nodalPointIconHandler = (nodalPointIcon) => (
    this.setResult((result) => result.setIn(NODAL_POINT_ICON_PATH, nodalPointIcon))
  )

  renderNodalPointType () {
    const currentValue = this.getResult().getIn(NODAL_POINT_ICON_PATH)
    const typeInfo = NODAL_POINT_ICON_DICTIONARY[currentValue]
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
