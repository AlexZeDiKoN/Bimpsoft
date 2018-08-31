import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import { colors } from '../../../constants'
import i18n from '../../../i18n'
import { colorOption } from './render'

const { FormRow } = components.form

const WithColor = (Component) => class ColorComponent extends Component {
  static propTypes = {
    color: PropTypes.string,
  }

  constructor (props) {
    super(props)
    this.state.color = props.color || colors.BLUE
  }

  colorChangeHandler = (value) => this.setState({ color: value })

  fillResult (result) {
    super.fillResult(result)
    result.color = this.state.color
  }

  renderColor () {
    return (
      <FormRow label={i18n.COLOR}>
        <Select value={this.state.color} onChange={this.colorChangeHandler}>
          {colorOption(colors.BLUE, i18n.BLUE)}
          {colorOption(colors.RED, i18n.RED)}
          {colorOption(colors.BLACK, i18n.BLACK)}
          {colorOption(colors.GREEN, i18n.GREEN)}
          {colorOption(colors.YELLOW, i18n.YELLOW)}
        </Select>
      </FormRow>
    )
  }
}

export default WithColor
