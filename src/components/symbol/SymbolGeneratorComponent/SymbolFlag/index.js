import React from 'react'
import PropTypes from 'prop-types'
import './style.css'

export default class SymbolFlag extends React.Component {
  onChange = () => {
    this.props.onChange(!this.props.checked)
  }

  onPreviewStart = () => {
    this.props.onPreviewStart(!this.props.checked)
  }

  onPreviewEnd = () => {
    this.props.onPreviewEnd && this.props.onPreviewEnd()
  }

  render () {
    return (
      <div className="symbol-flag" >
        <div className="symbol-flag-input">
          <input
            type="checkbox"
            checked={this.props.checked}
            onMouseEnter = { this.onPreviewStart }
            onMouseLeave = { this.onPreviewEnd }
            onChange = { this.onChange }
          />
        </div>
        <label>{this.props.label}</label>
      </div>
    )
  }
}

SymbolFlag.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.string,
  onChange: PropTypes.func,
  onPreviewStart: PropTypes.func,
  onPreviewEnd: PropTypes.func,
}
