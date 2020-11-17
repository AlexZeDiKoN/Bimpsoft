import React from 'react'
import { Select } from 'antd'
import { components } from '@C4/CommonComponents'
import i18n from '../../../i18n'
import { colors } from '../../../constants'
import { evaluateColor } from '../../../constants/colors'
import { HATCH_TYPE } from '../../../constants/drawLines'

const { FormRow } = components.form

export const HATCH_TYPES = {
  none: { text: i18n.NO_ONE, value: HATCH_TYPE.NONE },
  leftToRight: { text: i18n.LEFT_TO_RIGHT, value: HATCH_TYPE.LEFT_TO_RIGHT },
}

const PATH_HATCH = [ 'attributes', 'hatch' ]
const PATH_FILL = [ 'attributes', 'fill' ]

const TYPE_LIST_JSX = Object.values(HATCH_TYPES).map(({ value, text }) => (
  <Select.Option value={value} key={value}>{text}</Select.Option>
))

const WithHatch = (Component) => class FillComponent extends Component {
  hatchChangeHandler = (hatch) => {
    if (hatch !== HATCH_TYPE.NONE) {
      let fill = this.getResult().getIn(PATH_FILL)
      if (fill === evaluateColor(colors.TRANSPARENT) || fill === colors.TRANSPARENT) {
        fill = colors.BLACK
        this.setResult((result) => result.setIn(PATH_FILL, fill).setIn(PATH_HATCH, hatch))
        return
      }
    }
    this.setResult((result) => result.setIn(PATH_HATCH, hatch))
  }

  renderHatch () {
    const value = this.getResult().getIn(PATH_HATCH)
    const canEdit = this.isCanEdit()

    return (
      <FormRow label={i18n.HATCH}>
        <Select
          value={value}
          onChange={this.hatchChangeHandler}
          className={!canEdit ? 'modals-input-disabled' : ''}
          disabled={!canEdit}>
          {TYPE_LIST_JSX}
        </Select>
      </FormRow>
    )
  }
}

export default WithHatch
