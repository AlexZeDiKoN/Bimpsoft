import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import './style.css'

const { names: iconNames, IconButton } = components.icons

const VisibilityButton = (props) => {
  const { title, visible, onChange, isDark } = props

  const clickHandler = () => {
    onChange && onChange(!visible)
  }

  const classNames = [ 'button_layers' ]

  isDark
    ? (visible ? classNames.push('active') : classNames.push('unActive'))
    : (visible ? classNames.push('closed') : classNames.push('unClosed'))

  return (
    <div className={classNames.join(' ')} title={title} onClick={clickHandler}>
      <IconButton
        icon={iconNames.DARK_EYE_ON_ACTIVE}
      />
    </div>
  )
}

VisibilityButton.propTypes = {
  title: PropTypes.string,
  visible: PropTypes.bool,
  isDark: PropTypes.bool,
  onChange: PropTypes.func,
}

export default VisibilityButton
