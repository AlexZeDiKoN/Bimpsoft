import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
// import { components } from '@DZVIN/CommonComponents'
import { getClickOutsideRef } from '../../../utils/clickOutside'

// const { IconHovered, names: iconNames } = components.icons

const colors = [
  '#4D4D4D', '#999999', '#FFFFFF', '#F44E3B', '#FE9200', '#FCDC00',
  '#DBDF00', '#A4DD00', '#68CCCA', '#73D8FF', '#AEA1FF', '#FDA1FF',
  '#333333', '#808080', '#cccccc', '#D33115', '#E27300', '#FCC400',
  '#B0BC00', '#68BC00', '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF',
  '#000000', '#666666', '#B3B3B3', '#9F0500', '#C45100', '#FB9E00',
  '#808900', '#194D33', '#0C797D', '#0062B1', '#653294', '#AB149E',
]

export default class ColorPicker extends React.Component {
  static propTypes = {
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
      const el = target
      const { top, left } = el.getBoundingClientRect()
      return { opened, top, left }
    } else {
      return { opened }
    }
  })

  clickColorHandler = ({ color }) => this.props.onChange(color)

  inputChangeHandler = ({ target: { value } }) => this.props.onChange && this.props.onChange(value)

  clearHandler = () => this.props.onChange && this.props.onChange('')

  clickOutsideRef = getClickOutsideRef(() => this.setState({ opened: false }))

  render () {
    const { color } = this.props
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
        <ColorButton color={color} onClick={this.clickHandler} />
      </div>
    )
  }
}

class ColorButton extends React.Component {
  static propTypes = {
    color: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
  }

  clickHandler = (e) => this.props.onClick({ color: this.props.color, target: e.target })

  render () {
    const { color, className } = this.props
    const extClassName = (color === undefined)
      ? ' color-picker-button-undefined'
      : (color === null || !color.length) ? ' color-picker-button-empty' : ''
    return (
      <button
        className={'color-picker-button' + (className ? ` ${className}` : '') + extClassName}
        style={{ backgroundColor: color }}
        onClick={this.clickHandler}
      >
      </button>
    )
  }
}
