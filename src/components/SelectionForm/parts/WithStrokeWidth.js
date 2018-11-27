import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import { typeDiv, typeOption } from './render'

const { FormRow } = components.form
const DEFAULT_VALUE = 2
const VALUES = [ 1, 2, 3, 4, 5, 7, 9, 10, 12, 14, 16 ]

const WithStrokeWidth = (Component) => class LineTypeComponent extends Component {
  static propTypes = {
    amplifiers: PropTypes.object,
  }

  constructor (props) {
    super(props)
    let { amplifiers: { strokeWidth } = {} } = props
    strokeWidth = parseFloat(strokeWidth)
    strokeWidth = Number.isNaN(strokeWidth) ? DEFAULT_VALUE : strokeWidth
    this.state.strokeWidth = strokeWidth
  }

  strokeWidthChangeHandler = (strokeWidth) => this.setState({ strokeWidth })

  fillResult (result) {
    super.fillResult(result)
    if (!result.amplifiers) {
      result.amplifiers = {}
    }
    result.amplifiers.strokeWidth = this.state.strokeWidth
  }

  renderStrokeWidth () {
    const { strokeWidth } = this.state
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
