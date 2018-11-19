import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { getClickOutsideRef } from '../../../utils/clickOutside'

const colors = [

  '#FFFFFF',
  '#ff666b',
  '#ff9e66',
  '#e6e65c',
  '#c7f261',
  '#ccff99',
  '#b3ffff',
  '#6666ff',
  '#a666ff',
  '#ff66ff',

  '#000000',
  '#ff0000',
  '#ff6600',
  '#ffff00',
  '#77ff00',
  '#00ff00',
  '#00ffff',
  '#0000ff',
  '#6c00ff',
  '#ff00ff',

  '#555555',
  '#9a0000',
  '#993b00',
  '#999900',
  '#4a9900',
  '#009900',
  '#009999',
  '#000099',
  '#400099',
  '#990099',
]

export default class ColorPicker extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    color: PropTypes.string,
    onChange: PropTypes.func,
  }

  state = {
    opened: false,
  }

  buttonRef = React.createRef()

  clickHandler = ({ color, target }) => this.setState((state) => {
    const opened = !state.opened
    if (opened) {
      const { top, left } = target.getBoundingClientRect()
      return { opened, top, left }
    } else {
      return { opened }
    }
  })

  clickColorHandler = ({ color }) => this.props.onChange(color)

  inputChangeHandler = ({ target: { value } }) => this.props.onChange && this.props.onChange(value)

  clickOutsideRef = getClickOutsideRef(() => this.setState({ opened: false }))

  render () {
    const { color, title } = this.props
    const { opened, top, left } = this.state
    const classNames = [ 'color-picker' ]
    if (this.props.className) {
      classNames.push(this.props.className)
    }
    if (opened) {
      classNames.push('color-picker-opened')
    }
    return (
      <div className={classNames.join(' ')} ref={this.clickOutsideRef}>
        {opened && (<div className="color-picker-popup" style={{ top, left }}>
          <div className="color-picker-list">
            {colors.map((color) => (<ColorButton key={color} color={color} onClick={this.clickColorHandler} />))}
          </div>
          <div className="color-picker-controls">
            <input value={color || ''} onChange={this.inputChangeHandler} />
            <ColorButton color={''} onClick={this.clickColorHandler} />
            <ColorButton className="color-picker-close-button" color={color} onClick={this.clickHandler} />
          </div>
        </div>)}
        <ColorButton title={title} color={color} onClick={this.clickHandler} />
      </div>
    )
  }
}

class ColorButton extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    color: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
  }

  clickHandler = (e) => this.props.onClick({ color: this.props.color, target: e.target })

  render () {
    const { color, title, className } = this.props
    const extClassName = (color === undefined)
      ? ' color-picker-button-undefined'
      : (color === null || !color.length) ? ' color-picker-button-empty' : ''
    return (
      <button
        title={title}
        className={`color-picker-button${className ? ` ${className}` : ''}${extClassName}`}
        style={{ backgroundColor: color }}
        onClick={this.clickHandler}
      >
      </button>
    )
  }
}
