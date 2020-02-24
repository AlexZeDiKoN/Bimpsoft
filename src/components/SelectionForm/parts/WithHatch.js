import React from 'react'
import { Select } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'

const { FormRow } = components.form

export const HATCH_TYPES = {
  none: { text: i18n.NO_ONE, value: 'none' },
  leftToRight: { text: i18n.LEFT_TO_RIGHT, value: 'left-to-right' },
}

const PATH = [ 'attributes', 'hatch' ]

const TYPE_LIST_JSX = Object.values(HATCH_TYPES).map(({ value, text }) => (
  <Select.Option value={value} key={value}>{text}</Select.Option>
))

const WithHatch = (Component) => class FillComponent extends Component {
  hatchChangeHandler = (fill) => this.setResult((result) => result.setIn(PATH, fill))

  renderHatch () {
    const value = this.getResult().getIn(PATH)
    const canEdit = this.isCanEdit()

    return (
      <FormRow label={i18n.HATCH}>
        <Select value={value} onChange={this.hatchChangeHandler} disabled={!canEdit}>
          {TYPE_LIST_JSX}
        </Select>
      </FormRow>
    )
  }
}

export default WithHatch
