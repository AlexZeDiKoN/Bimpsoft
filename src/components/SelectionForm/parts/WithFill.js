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
    fill: PropTypes.string,
  }

  constructor (props) {
    super(props)
    this.state.fill = props.fill || colors.TRANSPARENT
  }

  fillChangeHandler = (fill) => this.setState({ fill })

  fillResult (result) {
    super.fillResult(result)
    result.fill = this.state.fill
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
      </Select>
    ) : colorDiv(fill)

    return (
      <FormRow label={i18n.COLOR}>
        {value}
      </FormRow>
    )
  }
}

export default WithFill
