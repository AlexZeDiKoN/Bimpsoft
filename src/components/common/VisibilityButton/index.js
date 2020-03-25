import React from 'react'
import PropTypes from 'prop-types'
import { IButton, IconNames } from '@DZVIN/CommonComponents'
import './style.css'

const VisibilityButton = (props) => {
  const { title, visible, onChange, isDark } = props

  const clickHandler = (event) => {
    // Prevent event from triggering in other wrappers
    event.stopPropagation()
    onChange(!visible)
  }

  const classNames = [ 'button_layers' ]

  isDark
    ? (visible ? classNames.push('active') : classNames.push('unActive'))
    : (visible ? classNames.push('closed') : classNames.push('unClosed'))

  return (
    <div className={classNames.join(' ')} onClick={clickHandler}>
      <IButton
        title={title}
        icon={IconNames.DARK_EYE_ON}
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

VisibilityButton.defaultProps = {
  onChange: () => {},
}

export default VisibilityButton
