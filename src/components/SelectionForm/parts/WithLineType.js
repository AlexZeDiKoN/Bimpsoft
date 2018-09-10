import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import { typeDiv, typeOption } from './render'

const { FormRow } = components.form
const TYPE_SOLID = 'solid'
const TYPE_DASHED = 'dashed'

const types = {
  [TYPE_SOLID]: { text: i18n.SOLID, value: 'solid' },
  [TYPE_DASHED]: { text: i18n.DASHED, value: 'dashed' },
}

const WithLineType = (Component) => class LineTypeComponent extends Component {
  static propTypes = {
    lineType: PropTypes.string,
  }

  constructor (props) {
    super(props)
    this.state.lineType = props.lineType || TYPE_SOLID
  }

  lineTypeChangeHandler = (lineType) => this.setState({ lineType })

  fillResult (result) {
    super.fillResult(result)
    result.lineType = this.state.lineType
  }

  renderLineType () {
    const { lineType } = this.state
    const typeInfo = types[lineType]
    const canEdit = this.isCanEdit()

    const value = canEdit ? (
      <Select value={ lineType } onChange={this.lineTypeChangeHandler} >
        {typeOption(TYPE_SOLID, 'solid', i18n.SOLID)}
        {typeOption(TYPE_DASHED, 'dashed', i18n.DASHED)}
      </Select>
    ) : typeDiv(typeInfo.value, typeInfo.text)

    return (
      <FormRow label={i18n.LINE_TYPE}>
        {value}
      </FormRow>
    )
  }
}

export default WithLineType
