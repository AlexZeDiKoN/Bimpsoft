import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import './buttonIcon.css'

const { IconHovered } = components.icons

const ButtonIcon = (props) => {
  const { onClick, value, icon, text, title, checked = false, disabled = false, children } = props
  const clickHandler = () => !disabled && onClick && onClick(value)
  return (
    <>
      <Tooltip placement="bottomLeft" title={text} mouseEnterDelay={0.5}>
        <IconHovered
          className={`icon-button ${checked && 'active'} ${disabled && 'disabled'}`}
          title={title}
          icon={icon}
          onClick={clickHandler}
        />
      </Tooltip>
      {!disabled && children && (
        <div className="icon-button-sub-panel">
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
  children: PropTypes.oneOfType([ PropTypes.node, PropTypes.arrayOf(PropTypes.node) ]),
}

export default ButtonIcon
