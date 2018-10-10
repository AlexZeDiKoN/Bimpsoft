import React from 'react'
import { components } from '@DZVIN/CommonComponents'
import PropTypes from 'prop-types'
import './style.css'
const { icons: { Icon } } = components
export default class OpacityControl extends React.Component {
  changeHandler = ({ target: { value } }) => {
    this.props.onChange(parseFloat(value))
  }

  render () {
    return (
      <div className={'opacity-control ' + this.props.className}>
        <Icon className="opacity-control-icon" icon={this.props.icon}/>
        <input
          type="number"
          step="10"
          min="0"
          max="100"
          value={this.props.opacity}
          className="opacity-control-input"
          onChange={this.changeHandler}
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
