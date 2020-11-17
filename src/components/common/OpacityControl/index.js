import React from 'react'
import { InputNumber, Tooltip } from 'antd'
import { IButton } from '@C4/CommonComponents'
import PropTypes from 'prop-types'
import './style.css'
import { ColorTypes } from '@C4/CommonComponents/src/constants'
import { MOUSE_ENTER_DELAY } from '../../../constants/tooltip'
const OpacityControl = (props) => {
  const { title, icon, opacity, className, onChange } = props

  const changeHandler = (value) => {
    value = parseFloat(value)
    onChange(Number.isNaN(value) ? 0 : Math.max(0, Math.min(100, value)))
  }

  return (
    <div className={'opacity-control ' + className}>
      <Tooltip title={title} placement='topRight' mouseEnterDelay={MOUSE_ENTER_DELAY} className="opacity-control-block">
        <IButton
          colorType={ColorTypes.WHITE}
          className="opacity-control-icon"
          icon={icon}
        />
        <InputNumber
          size="small"
          step={10}
          min={0}
          max={100}
          value={opacity}
          className="opacity-control-input"
          onChange={changeHandler}
        />
      </Tooltip>
    </div>
  )
}

OpacityControl.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  opacity: PropTypes.number,
  icon: PropTypes.string,
  onChange: PropTypes.func,
}

export default OpacityControl
