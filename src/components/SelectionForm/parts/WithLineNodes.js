import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import { typeDiv, typeOption } from './render'

const { FormRow } = components.form

const NODE_NONE = 'none'
const NODE_CROSS_CIRCLE = 'cross-circle'

const types = {
  [NODE_NONE]: { text: i18n.NO_ONE, value: NODE_NONE },
  [NODE_CROSS_CIRCLE]: { text: i18n.CROSS_CIRCLE, value: NODE_CROSS_CIRCLE },
}

const WithLineNodes = (Component) => class LineNodesComponent extends Component {
  static propTypes = {
    amplifiers: PropTypes.object,
  }

  constructor (props) {
    super(props)
    let { amplifiers: { lineNodes } = {} } = props
    lineNodes = Object.entries(types).find(([ key, { value } ]) => value === lineNodes)
    lineNodes = lineNodes ? lineNodes[0] : NODE_NONE
    this.state.lineNodes = lineNodes
  }

  lineNodesChangeHandler = (lineNodes) => this.setState({ lineNodes })

  fillResult (result) {
    super.fillResult(result)
    !result.amplifiers && (result.amplifiers = {})
    const lineNodesInfo = types[this.state.lineNodes]
    result.amplifiers.lineNodes = lineNodesInfo && lineNodesInfo.value
  }

  renderLineNodes () {
    const { lineNodes } = this.state
    const typeInfo = types[lineNodes]
    const canEdit = this.isCanEdit()

    const value = canEdit
      ? (
        <Select value={lineNodes} onChange={this.lineNodesChangeHandler}>
          {typeOption(NODE_NONE, 'solid', types[NODE_NONE].text)}
          {typeOption(NODE_CROSS_CIRCLE, 'solid', types[NODE_CROSS_CIRCLE].text)}
        </Select>
      )
      : typeDiv('solid', typeInfo.text)

    return (
      <FormRow label={i18n.LINE_NODES}>
        {value}
      </FormRow>
    )
  }
}

export default WithLineNodes
