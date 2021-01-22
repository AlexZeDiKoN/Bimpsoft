import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'
import { IButton, IconNames } from '@C4/CommonComponents'
import './style.css'
import { MOUSE_ENTER_DELAY } from '../../../constants/tooltip'

const VisibilityButton = (props) => {
  const { title, visible, onChange, isDark, disabled, colorType } = props

  const clickHandler = (event) => {
    // Prevent event from triggering in other wrappers
    event.stopPropagation()
    onChange(!visible)
  }

  const classNames = [ 'button_layers' ]

  isDark
    ? ((visible || disabled) ? classNames.push('active') : classNames.push('unActive'))
    : ((visible || disabled) ? classNames.push('closed') : classNames.push('unClosed'))

  return (
    <div className={classNames.join(' ')}>
      <Tooltip mouseEnterDelay={MOUSE_ENTER_DELAY} title={title} placement='topRight'>
        <IButton
          colorType={colorType}
          onClick={clickHandler}
          icon={IconNames.DARK_EYE_ON}
          disabled={disabled}
        />
      </Tooltip>
    </div>
  )
}

VisibilityButton.propTypes = {
  title: PropTypes.string,
  visible: PropTypes.bool,
  disabled: PropTypes.bool,
  isDark: PropTypes.bool,
  onChange: PropTypes.func,
  colorType: PropTypes.string,
}

VisibilityButton.defaultProps = {
  onChange: () => {},
}

export default VisibilityButton
