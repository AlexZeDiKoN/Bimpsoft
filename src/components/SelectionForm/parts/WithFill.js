import React from 'react'
import { Select } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import { colors } from '../../../constants'
import i18n from '../../../i18n'
import { colorDiv, colorOption } from './render'

const { FormRow } = components.form

const PATH = [ 'attributes', 'fill' ]

const WithFill = (Component) => class FillComponent extends Component {
  fillChangeHandler = (fill) => this.setResult((result) => result.setIn(PATH, fill))

  renderFill (useHatch = false) {
    const fill = this.getResult().getIn(PATH)
    const canEdit = this.isCanEdit()
    const hatch = useHatch ? `/${i18n.HATCH_COLOR}` : ''
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
      <FormRow label={`${i18n.FILL_COLOR}${hatch}`}>
        {value}
      </FormRow>
    )
  }
}

export default WithFill
