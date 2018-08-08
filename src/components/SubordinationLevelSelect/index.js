import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import i18n from '../../i18n'
import { SubordinationLevel } from '../../constants'

const Option = Select.Option

export default class SubordinationLevelSelect extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
  }

  render () {
    const { value, onChange } = this.props
    return (
      <Select value={ value } onChange={onChange}>
        {SubordinationLevel.list.map(({ value, title }) => (
          <Option key={value} value={value}>{title}</Option>
        ))}
      </Select>
    )
  }
}
