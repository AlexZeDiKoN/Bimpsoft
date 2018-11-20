import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import { colors } from '../../../constants'
import i18n from '../../../i18n'
import { colorOption, colorDiv } from './render'

const { FormRow } = components.form

const WithColor = (Component) => class ColorComponent extends Component {
  static propTypes = {
    amplifiers: PropTypes.object,
  }

  constructor (props) {
    super(props)
    const { amplifiers: { color } = {} } = props
    this.state.color = color || colors.BLUE
  }

  colorChangeHandler = (color) => this.setState({ color })

  fillResult (result) {
    super.fillResult(result)
    if (!result.amplifiers) {
      result.amplifiers = {}
    }
    result.amplifiers.color = this.state.color
  }

  renderColor () {
    const { color } = this.state
    const canEdit = this.isCanEdit()
    const value = canEdit ? (
      <Select value={color} onChange={this.colorChangeHandler}>
        {colorOption(colors.BLUE)}
        {colorOption(colors.RED)}
        {colorOption(colors.BLACK)}
        {colorOption(colors.GREEN)}
        {colorOption(colors.YELLOW)}
        {colorOption(colors.WHITE)}
      </Select>
    ) : colorDiv(color)

    return (
      <FormRow label={i18n.COLOR}>
        {value}
      </FormRow>
    )
  }
}

export default WithColor
