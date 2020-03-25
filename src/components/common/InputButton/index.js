import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  ColorTypes,
  IButton,
  IconNames,
  Input,
} from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import './style.css'

const InputButton = (props) => {
  const {
    onChange,
    title,
    disabled,
    placeholder = i18n.FILTER,
  } = props
  const [ value, onChangeValue ] = useState('')
  const [ showSearch, setShowSearch ] = useState(false)
  return (
    <div className='input-button'>
      {!showSearch && <div className='input-button__title'>{title}</div>}
      <div className={showSearch ? 'active-search-input search-input' : 'search-input'}>
        <Input placeholder={placeholder} value={value} onChange={({ target: { value } }) => {
          onChangeValue(value)
          onChange(value)
        }}>
          {showSearch && <IButton
            icon={IconNames.MENU_SEARCH}
            onClick={() => {
              onChangeValue('')
              onChange('')
              setShowSearch(false)
            }}/>}
        </Input>
        {!showSearch && <IButton
          icon={IconNames.MENU_SEARCH}
          title={placeholder}
          colorType={ColorTypes.WHITE}
          disabled={disabled}
          onClick={() => setShowSearch(true)}/>}
      </div>
    </div>
  )
}

InputButton.propTypes = {
  onChange: PropTypes.func,
  title: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
}

export default InputButton
