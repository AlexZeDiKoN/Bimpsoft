import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { SubordinationLevel } from '../../constants'

const Option = Select.Option

export default class SubordinationLevelSelect extends React.Component {
  static propTypes = {
    value: PropTypes.number,
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
