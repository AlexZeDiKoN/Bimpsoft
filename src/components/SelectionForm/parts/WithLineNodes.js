import React from 'react'
import { Select } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import { nodesDiv, nodesOption } from './render'

const { FormRow } = components.form

const NODE_NONE = 'none'
const NODE_CROSS_CIRCLE = 'cross-circle'
const NODE_SQUARE = 'square'

const types = {
  [NODE_NONE]: { text: i18n.NO_ONE, value: NODE_NONE },
  [NODE_CROSS_CIRCLE]: { text: i18n.SHAPE_CIRCLE, value: NODE_CROSS_CIRCLE },
  [NODE_SQUARE]: { text: i18n.SHAPE_SQUARE, value: NODE_SQUARE },
}

const PATH = [ 'attributes', 'lineNodes' ]

const WithLineNodes = (Component) => class LineNodesComponent extends Component {
  lineNodesChangeHandler = (lineNodes) => this.setResult((result) => result.setIn(PATH, lineNodes))

  renderLineNodes () {
    const lineNodes = this.getResult().getIn(PATH)
    const typeInfo = types[lineNodes]
    const canEdit = this.isCanEdit()

    const value = canEdit
      ? (
        <Select value={lineNodes} onChange={this.lineNodesChangeHandler}>
          {nodesOption(types[NODE_NONE])}
          {nodesOption(types[NODE_CROSS_CIRCLE])}
          {nodesOption(types[NODE_SQUARE])}
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

export default WithLineNodes
