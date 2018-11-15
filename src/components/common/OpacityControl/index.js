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
    const { title, icon, opacity, className } = this.props
    return (
      <div className={'opacity-control ' + className}>
        <div className="opacity-control-block" title={title}>
          <Icon
            className="opacity-control-icon"
            icon={icon}
          />
        </div>
        <input
          title={title}
          type="number"
          step="10"
          min="0"
          max="100"
          value={opacity}
          className="opacity-control-input"
          onChange={this.changeHandler}
        />
      </div>
    )
  }
}

OpacityControl.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  opacity: PropTypes.number,
  icon: PropTypes.string,
  onChange: PropTypes.func,
}
