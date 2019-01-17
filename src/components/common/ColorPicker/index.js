import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { getClickOutsideRef } from '../../../utils/clickOutside'

const colors = [

  '#ffffff', // '#FFFFFFaa',
  '#ff999c', // '#ff666baa',
  '#ffbe99', // '#ff9e66aa',
  '#eeee92', // '#e6e65caa',
  '#daf696', // '#c7f261aa',
  '#ddffbb', // '#ccff99aa',
  '#ccffff', // '#b3ffffaa',
  '#9999ff', // '#6666ffaa',
  '#c499ff', // '#a666ffaa',
  '#ff99ff', // '#ff66ffaa',

  '#555555', // '#000000aa',
  '#ff5555', // '#ff0000aa',
  '#ff9955', // '#ff6600aa',
  '#ffff55', // '#ffff00aa',
  '#a4ff55', // '#77ff00aa',
  '#55ff55', // '#00ff00aa',
  '#55ffff', // '#00ffffaa',
  '#5555ff', // '#0000ffaa',
  '#9d55ff', // '#6c00ffaa',
  '#ff55ff', // '#ff00ffaa',

  '#8e8e8e', // '#555555aa',
  '#bc5555', // '#9a0000aa',
  '#bb7c55', // '#993b00aa',
  '#bbbb55', // '#999900aa',
  '#86bb55', // '#4a9900aa',
  '#55bb55', // '#009900aa',
  '#55bbbb', // '#009999aa',
  '#5555bb', // '#000099aa',
  '#8055bb', // '#400099aa',
  '#bb55bb', // '#990099aa',
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
      return { opened, top: target.offsetTop, left: target.offsetLeft }
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
