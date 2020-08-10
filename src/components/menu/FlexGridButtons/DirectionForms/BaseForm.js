import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import FocusTrap from 'react-focus-lock'
import { HotKey, HotKeysContainer } from '../../../common/HotKeys'
import * as shortcuts from '../../../../constants/shortcuts'
import { YES } from '../../../../i18n/ua'
import './baseForm.css'

const { default: Form, buttonCancel, Button, FormItem } = components.form

const BaseForm = (props) => {
  const {
    onCancel, onOk,
    title, description, okBtnText,
    list, option: Option,
    isChecked, isDisabled,
    updateState, updateHighLight, computeParams,
  } = props

  const handleSelect = ({ target: { value, checked } }) => {
    updateHighLight(value, checked)
    updateState(value, checked)
  }

  const handleOkay = () => onOk(computeParams)

  const options = list.map(({ name, value }) =>
    <div key={value}>
      <Option
        className={'dir_option'}
        value={value}
        checked={isChecked(value)}
        disabled={isDisabled && isDisabled(value)}
        onChange={handleSelect}
      >
        <div title={name} className='dir_info'>{name}</div>
      </Option>
    </div>
  )

  return (
    <>
      <div className="not-clickable-area"/>
      <FocusTrap className="form-direction_wrapper">
        <HotKeysContainer>
          <Form className="form-direction">
            <div className="form-direction_title">{title}</div>
            <div className="form-direction_desc">{description}:</div>
            <FormItem><div className={'options_wrapper'}>{options}</div></FormItem>
            <FormItem>
              <Button onClick={handleOkay} text={okBtnText || YES}/>
              {buttonCancel(onCancel)}
              <HotKey selector={shortcuts.ESC} onKey={onCancel}/>
            </FormItem>
          </Form>
        </HotKeysContainer>
      </FocusTrap>
    </>
  )
}

BaseForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  option: PropTypes.func.isRequired,
  updateState: PropTypes.func.isRequired,
  updateHighLight: PropTypes.func.isRequired,
  isChecked: PropTypes.oneOfType([ PropTypes.func, PropTypes.bool ]),
  isDisabled: PropTypes.oneOfType([ PropTypes.func, PropTypes.bool ]),
  title: PropTypes.string,
  okBtnText: PropTypes.string,
  description: PropTypes.string,
  list: PropTypes.array,
  computeParams: PropTypes.oneOfType([ PropTypes.array, PropTypes.bool ]),
}

export default BaseForm
