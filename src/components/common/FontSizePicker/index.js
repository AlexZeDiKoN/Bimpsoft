import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { Input } from '@C4/CommonComponents'
import { getClickOutsideRef } from '../../../utils/clickOutside'

const fontSizes = [
  9, 10, 11, 12, 14, 16,
  18, 20, 22, 24, 26, 28,
  36, 40, 48, 56, 72, 80,
]

export default class FontSizePicker extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    fontSize: PropTypes.number,
    onChange: PropTypes.func,
    onPreview: PropTypes.func,
  }

  state = {
    opened: false,
  }

  clickHandler = (e) => this.setState({ opened: true })

  clickFontSizeHandler = (fontSizes) => {
    this.setState({ opened: false })
    this.props.onChange(fontSizes)
  }

  inputChangeHandler = ({ target: { value } }) => this.props.onChange(value)

  clickOutsideRef = getClickOutsideRef(() => this.setState({ opened: false }))

  mouseOutHandler = () => this.props.onPreview(null)

  render () {
    const { fontSize, onPreview } = this.props
    const { opened } = this.state
    const classNames = [ 'font-size-picker' ]
    if (this.props.className) {
      classNames.push(this.props.className)
    }
    if (opened) {
      classNames.push('font-size-picker-opened')
    }
    return (
      <div className={classNames.join(' ')} ref={this.clickOutsideRef}>
        {opened && (<div className="font-size-picker-popup">
          <div className="font-size-picker-list" onMouseLeave={this.mouseOutHandler} >
            {fontSizes.map((itemfontSize) => (
              <FontSizeButton
                checked={fontSize === itemfontSize}
                key={itemfontSize}
                fontSize={itemfontSize}
                onClick={this.clickFontSizeHandler}
                onPreview={onPreview}
              />
            ))}
          </div>
        </div>)}
        <Input.Integer
          className="font-size-picker-input"
          value={fontSize}
          min={0}
          max={999}
          onChange={this.inputChangeHandler}
          onClick={this.clickHandler}
        />
      </div>
    )
  }
}

class FontSizeButton extends React.Component {
  static propTypes = {
    fontSize: PropTypes.number,
    checked: PropTypes.bool,
    onClick: PropTypes.func,
    onPreview: PropTypes.func,
  }

  clickHandler = () => this.props.onClick(this.props.fontSize)

  mouseEnterHandler = () => this.props.onPreview(this.props.fontSize)

  render () {
    const { fontSize, checked } = this.props
    return (
      <button
        className={'font-size-picker-button' + (checked ? ' font-size-picker-button-checked' : '')}
        onClick={this.clickHandler}
        onMouseEnter={this.mouseEnterHandler}
      >
        {fontSize}
      </button>
    )
  }
}
