import React from 'react'
import PropTypes from 'prop-types'
import './style.css'

export default class ScaleControl extends React.Component {
  changeHandler = ({ target: { value } }) => {
    const { onChange, name } = this.props
    onChange(name, Math.abs(parseInt(value) || 1))
  }

  render () {
    const { value, step } = this.props
    const stepInput = step || (value < 15 ? 1 : Math.ceil(value / 100) * 10)
    return (
      <>
        <input
          type="number"
          className="scale-control-input"
          step={stepInput}
          min="1"
          value={value}
          title={''}
          onChange={this.changeHandler}
        />
      </>
    )
  }
}

ScaleControl.propTypes = {
  name: PropTypes.string,
  value: PropTypes.number,
  onChange: PropTypes.func,
  step: PropTypes.number,
}
