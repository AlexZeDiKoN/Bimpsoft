import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { Popover } from 'antd'
import { SketchPicker } from 'react-color'

export default class ColorPicker extends React.Component {
  onChange = (color) => {
    this.props.onChange && this.props.onChange(color.hex)
  }

  render () {
    let { color } = this.props
    if (color === null) {
      color = '#fff'
    }
    return (
      <Popover
        content={(<SketchPicker color={color} onChangeComplete={this.onChange} />)}
        trigger="click"
        placement="bottomRight"
      >
        <div
          className={'color-picker ' + this.props.className}
          style={{
            backgroundColor: color,
          }}
        >
        </div>
      </Popover>
    )
  }
}

ColorPicker.propTypes = {
  className: PropTypes.string,
  color: PropTypes.number,
  onChange: PropTypes.func,
}
