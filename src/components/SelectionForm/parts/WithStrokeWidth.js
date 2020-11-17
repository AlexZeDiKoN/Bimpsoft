import React from 'react'
import { Select } from 'antd'
import { components } from '@C4/CommonComponents'
import i18n from '../../../i18n'
import { typeDiv, typeOption } from './render'

const { FormRow } = components.form
const VALUES = [ 1, 2, 3, 4, 5, 7, 9, 10, 12, 14, 16 ]

const PATH = [ 'attributes', 'strokeWidth' ]

const WithStrokeWidth = (Component) => class LineTypeComponent extends Component {
  strokeWidthChangeHandler = (strokeWidth) => this.setResult((result) => result.setIn(PATH, strokeWidth))

  renderStrokeWidth () {
    const strokeWidth = this.getResult().getIn(PATH)
    const canEdit = this.isCanEdit()

    const value = canEdit
      ? (
        <Select value={ strokeWidth } onChange={this.strokeWidthChangeHandler}>
          { VALUES.map((value) => typeOption(value, 'solid', value, null, value)) }
        </Select>
      )
      : typeDiv('solid', strokeWidth, null, strokeWidth)

    return (
      <FormRow label={i18n.LINE_WIDTH}>
        {value}
      </FormRow>
    )
  }
}

export default WithStrokeWidth
