import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import './buttonIcon.css'

const { IconHovered } = components.icons

const ButtonIcon = (props) => {
  const {
    onClick, className,
    icon, text, title,
    value, checked = false, disabled = false,
    children, childWrapClassName,
  } = props
  const clickHandler = () => !disabled && onClick && onClick(value)
  const classNames = [ 'icon-button' ]
  checked && classNames.push('active')
  disabled && classNames.push('disabled')
  className && classNames.push(className)
  return (
    <>
      <Tooltip placement="bottomLeft" title={text} mouseEnterDelay={0.5}>
        <IconHovered
          className={classNames.join(' ')}
          title={title}
          icon={icon}
          onClick={clickHandler}
        />
      </Tooltip>
      {!disabled && children && (
        <div className={childWrapClassName || 'icon-button-sub-panel'}>
          {children}
        </div>
      )}
    </>
  )
}

ButtonIcon.propTypes = {
  icon: PropTypes.string,
  text: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.any,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  childWrapClassName: PropTypes.string,
  children: PropTypes.oneOfType([ PropTypes.node, PropTypes.arrayOf(PropTypes.node) ]),
}

export default ButtonIcon
