import React from 'react'
import { Select } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import { colors } from '../../../constants'
import i18n from '../../../i18n'
import { colorOption, colorDiv } from './render'

const { FormRow } = components.form

const PATH = [ 'attributes', 'color' ]

const WithColor = (Component) => class ColorComponent extends Component {
  colorChangeHandler = (color) => this.setResult((result) => result.setIn(PATH, color))

  renderColor () {
    const color = this.getResult().getIn(PATH)
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
