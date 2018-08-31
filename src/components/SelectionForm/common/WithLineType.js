import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import { typeOption } from './render'

const { FormRow } = components.form
const TYPE_SOLID = 'solid'
const TYPE_DASHED = 'dashed'

const WithLineType = (Component) => class LineTypeComponent extends Component {
  static propTypes = {
    lineType: PropTypes.string,
  }

  constructor (props) {
    super(props)
    this.state.lineType = props.lineType || TYPE_SOLID
  }

  lineTypeChangeHandler = (value) => this.setState({ lineType: value })

  fillResult (result) {
    super.fillResult(result)
    result.lineType = this.state.lineType
  }

  renderLineType () {
    return (
      <FormRow label={i18n.LINE_TYPE}>
        <Select value={ this.state.lineType } onChange={this.lineTypeChangeHandler} >
          {typeOption(TYPE_SOLID, 'solid', i18n.SOLID)}
          {typeOption(TYPE_DASHED, 'dashed', i18n.DASHED)}
        </Select>
      </FormRow>
    )
  }
}

export default WithLineType
