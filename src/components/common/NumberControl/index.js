import React from 'react'
import PropTypes from 'prop-types'
import { Input } from '@C4/CommonComponents'
import './style.css'

export default class NumberControl extends React.Component {
  changeHandler = ({ target: { value } }) => {
    const { onChange, name } = this.props
    onChange(name, parseFloat(value))
  }

  render () {
    const { value, disabled, maxNumber } = this.props
    const step = 1
    return (
      <>
        <Input.Number
          type="number"
          className="number-control-input"
          disabled={disabled}
          step={step}
          min="0"
          max={maxNumber}
          value={value}
          onChange={this.changeHandler}
        />
      </>
    )
  }
}

NumberControl.propTypes = {
  name: PropTypes.string,
  value: PropTypes.number,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  maxNumber: PropTypes.number,
}
