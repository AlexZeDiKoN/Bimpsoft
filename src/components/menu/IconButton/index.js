import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import './style.css'
const { IconHovered } = components.icons

export default class IconButton extends React.PureComponent {
  static propTypes = {
    icon: PropTypes.string,
    text: PropTypes.string,
    title: PropTypes.string,
    value: PropTypes.any,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    children: PropTypes.oneOfType([ PropTypes.node, PropTypes.arrayOf(PropTypes.node) ]),
  }

  clickHandler = () => {
    const { onClick, value, disabled } = this.props

    !disabled && onClick && onClick(value)
  }

  render () {
    const { icon, text, title, checked = false, disabled = false, children } = this.props

    const classList = [ 'icon-button' ]
    let useIcon = icon
    let useHover = icon
    let base
    if (icon && icon.slice(-8) === '-default') {
      base = icon.slice(0, -7)
    } else if (icon && icon.slice(-7) === '-active') {
      base = icon.slice(0, -6)
    }
    if (base) {
      const activeIcon = `${base}active`
      const hoverIcon = `${base}hover`
      const disableIcon = `${base}disable`
      classList.push('icon-button-hoverable')
      useHover = hoverIcon
      if (disabled) {
        useIcon = disableIcon
        useHover = disableIcon
      } else if (checked) {
        useIcon = activeIcon
        classList.push('icon-button-checked')
      }
    }
    // console.log({ title, checked, disabled, base, useIcon, useHover })
    return (
      <div className={classList.join(' ')}>
        <Tooltip placement="bottomLeft" title={text} mouseEnterDelay={0.5}>
          <IconHovered
            title={title}
            icon={useIcon}
            hoverIcon={useHover}
            onClick={this.clickHandler}
          />
        </Tooltip>
        {!disabled && children && (
          <div className="icon-button-sub-panel">
            {children}
          </div>
        )}
      </div>
    )
  }
}
