import React from 'react'
import PropTypes from 'prop-types'
import { Select, Input } from 'antd'
import { SubordinationLevel } from '../../constants'

const Option = Select.Option

export default class SubordinationLevelSelect extends React.Component {
  static propTypes = {
    readOnly: PropTypes.bool,
    value: PropTypes.number,
    onChange: PropTypes.func,
  }

  render () {
    const { value, onChange, readOnly } = this.props
    if (readOnly) {
      const levelInfo = SubordinationLevel.list.find((level) => value === level.value)
      return (<Input value={levelInfo ? levelInfo.title : null} readOnly={true} />)
    } else {
      return (
        <Select value={ value } showArrow={false} onChange={onChange}>
          {SubordinationLevel.list.map(({ value, title }) => (
            <Option key={value} value={value}>{title}</Option>
          ))}
        </Select>
      )
    }
  }
}
