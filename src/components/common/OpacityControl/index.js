import React from 'react'
import { InputNumber } from 'antd'
import { IButton } from '@DZVIN/CommonComponents'
import PropTypes from 'prop-types'
import './style.css'
import { ColorTypes } from '@DZVIN/CommonComponents/src/constants'
const OpacityControl = (props) => {
  const { title, icon, opacity, className, onChange } = props

  const changeHandler = (value) => {
    value = parseFloat(value)
    onChange(Number.isNaN(value) ? 0 : Math.max(0, Math.min(100, value)))
  }

  return (
    <div className={'opacity-control ' + className}>
      <div className="opacity-control-block">
        <IButton
          title={title}
          colorType={ColorTypes.WHITE}
          className="opacity-control-icon"
          icon={icon}
        />
      </div>
      <InputNumber
        size="small"
        title={title}
        step={10}
        min={0}
        max={100}
        value={opacity}
        className="opacity-control-input"
        onChange={changeHandler}
      />
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
