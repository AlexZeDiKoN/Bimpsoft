import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'
import {
  ColorTypes,
  IButton,
  IconNames,
  Input,
} from '@C4/CommonComponents'
import i18n from '../../../i18n'
import './style.css'
import { MOUSE_ENTER_DELAY } from '../../../constants/tooltip'

const InputButton = (props) => {
  const {
    onChange,
    title,
    disabled,
    initValue,
    placeholder = i18n.FILTER,
  } = props
  const [ value, onChangeValue ] = useState(initValue || '')
  const [ showSearch, setShowSearch ] = useState(!!initValue)
  return (
    <div className='input-button'>
      {!showSearch && <div className='input-button__title'>{title}</div>}
      <div className={showSearch ? 'active-search-input search-input' : 'search-input'}>
        <Input placeholder={placeholder} value={value} onChange={({ target: { value } }) => {
          onChangeValue(value)
          onChange(value)
        }}>
          {showSearch &&
          <Tooltip title={i18n.CLEAR} mouseEnterDelay={MOUSE_ENTER_DELAY}>
            <IButton
              icon={IconNames.DARK_CLOSE_ROUND}
              onClick={() => {
                onChangeValue('')
                onChange('')
                setShowSearch(false)
              }}/>
          </Tooltip>}
        </Input>
        {!showSearch &&
        <Tooltip title={placeholder} mouseEnterDelay={MOUSE_ENTER_DELAY} placement='topRight'>
          <IButton
            icon={IconNames.MENU_SEARCH}
            colorType={ColorTypes.WHITE}
            disabled={disabled}
            onClick={() => setShowSearch(true)}
          />
        </Tooltip>}
      </div>
    </div>
  )
}

InputButton.propTypes = {
  onChange: PropTypes.func,
  title: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  initValue: PropTypes.string,
}

export default InputButton
