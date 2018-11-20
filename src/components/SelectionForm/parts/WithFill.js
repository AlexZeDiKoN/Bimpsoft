import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import { colors } from '../../../constants'
import i18n from '../../../i18n'
import { colorDiv, colorOption } from './render'

const { FormRow } = components.form

const WithFill = (Component) => class FillComponent extends Component {
  static propTypes = {
    amplifiers: PropTypes.object,
  }

  constructor (props) {
    super(props)
    const { amplifiers: { fill } = {} } = props
    this.state.fill = fill || colors.TRANSPARENT
  }

  fillChangeHandler = (fill) => this.setState({ fill })

  fillResult (result) {
    super.fillResult(result)
    if (!result.amplifiers) {
      result.amplifiers = {}
    }
    result.amplifiers.fill = this.state.fill
  }

  renderFill () {
    const { fill } = this.state
    const canEdit = this.isCanEdit()
    const value = canEdit ? (
      <Select value={fill} onChange={this.fillChangeHandler}>
        {colorOption(colors.TRANSPARENT)}
        {colorOption(colors.BLUE)}
        {colorOption(colors.RED)}
        {colorOption(colors.BLACK)}
        {colorOption(colors.GREEN)}
        {colorOption(colors.YELLOW)}
        {colorOption(colors.WHITE)}
      </Select>
    ) : colorDiv(fill)

    return (
      <FormRow label={i18n.FILLING}>
        {value}
      </FormRow>
    )
  }
}

export default WithFill
