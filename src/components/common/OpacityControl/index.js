import React from 'react'
import { Icon } from 'antd'
import PropTypes from 'prop-types'
import './style.css'

export default class OpacityControl extends React.Component {
  render () {
    const onChange = this.props.onChange ? (e) => {
      this.props.onChange(e.target.value)
    } : null
    return (
      <div className={'opacity-control ' + this.props.className}>
        <Icon className="opacity-control-icon" type={this.props.icon}/>
        <input
          type="number"
          step="10"
          min="0"
          max="100"
          value={this.props.opacity}
          className="opacity-control-input"
          onChange={onChange}
        />
      </div>
    )
  }
}

OpacityControl.propTypes = {
  className: PropTypes.string,
  opacity: PropTypes.number,
  icon: PropTypes.string,
  onChange: PropTypes.func,
}
