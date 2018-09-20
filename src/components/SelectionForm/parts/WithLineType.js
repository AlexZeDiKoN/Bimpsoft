import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import { typeDiv, typeOption } from './render'

const { FormRow } = components.form
const TYPE_SOLID = 'solid'
const TYPE_DASHED = 'dashed'
const TYPE_SHOW_LEVEL = 'show-level'

const types = {
  [TYPE_SOLID]: { text: i18n.SOLID, value: 'solid' },
  [TYPE_DASHED]: { text: i18n.DASHED, value: 'dashed' },
  [TYPE_SHOW_LEVEL]: { text: i18n.SHOW_LEVEL, value: 'show-level' },
}

const WithLineType = (Component) => class LineTypeComponent extends Component {
  static propTypes = {
    amplifiers: PropTypes.object,
    subordinationLevel: PropTypes.number,
  }

  constructor (props) {
    super(props)
    let { amplifiers: { lineType } = {} } = props
    lineType = Object.entries(types).find(([ key, { value } ]) => value === lineType)
    lineType = lineType ? lineType[0] : TYPE_SOLID
    this.state.lineType = lineType
  }

  lineTypeChangeHandler = (lineType) => this.setState({ lineType })

  fillResult (result) {
    super.fillResult(result)
    if (!result.amplifiers) {
      result.amplifiers = {}
    }
    const lineTypeInfo = types[this.state.lineType]
    result.amplifiers.lineType = lineTypeInfo && lineTypeInfo.value
  }

  renderLineType () {
    const { lineType, subordinationLevel } = this.state
    const typeInfo = types[lineType]
    const canEdit = this.isCanEdit()

    const value = canEdit
      ? (
        <Select value={ lineType } onChange={this.lineTypeChangeHandler}>
          {typeOption(TYPE_SOLID, 'solid', i18n.SOLID)}
          {typeOption(TYPE_DASHED, 'dashed', i18n.DASHED)}
          {typeOption(TYPE_SHOW_LEVEL, 'show-level', i18n.SHOW_LEVEL, subordinationLevel)}
        </Select>
      )
      : typeDiv(typeInfo.value, typeInfo.text, typeInfo.value === TYPE_SHOW_LEVEL ? subordinationLevel : null)

    return (
      <FormRow label={i18n.LINE_TYPE}>
        {value}
      </FormRow>
    )
  }
}

export default WithLineType
