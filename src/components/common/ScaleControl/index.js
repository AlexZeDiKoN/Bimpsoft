import React from 'react'
import PropTypes from 'prop-types'
import './style.css'

export default class ScaleControl extends React.Component {
  changeHandler = ({ target: { value } }) => {
    const { onChange, name } = this.props
    onChange(name, parseFloat(value))
  }

  render () {
    const { value } = this.props
    const step = value < 15 ? 1 : Math.ceil(value / 100) * 10
    return (
      <>
        <input
          type="number"
          className="scale-control-input"
          step={step}
          min="0"
          value={value}
          onChange={this.changeHandler}
        /> пікселів
      </>
    )
  }
}

ScaleControl.propTypes = {
  name: PropTypes.string,
  value: PropTypes.number,
  onChange: PropTypes.func,
}
