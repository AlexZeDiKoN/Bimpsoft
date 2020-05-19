import React from 'react'
import PropTypes from 'prop-types'
import { Select, Input } from 'antd'
import { SubordinationLevel } from '../../constants'
import * as i18n from '../../i18n/ua'

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
      return (<Input style={{
        background: '#f5f5f5',
        color: '5e6269',
      }} value={levelInfo ? levelInfo.title : null} readOnly={true} />)
    } else {
      return (
        <Select value={ value } onChange={onChange}>
          <Option value={SubordinationLevel.UNDEFINED}>{i18n.UNDEFINED}</Option>
          {SubordinationLevel.list.map(({ value, title }) => (
            <Option key={value} value={value}>{title}</Option>
          ))}
        </Select>
      )
    }
  }
}
