import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Input } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import FocusTrap from 'react-focus-lock'
import { HotKeysContainer, HotKey } from '../common/HotKeys'
import * as shortcuts from '../../constants/shortcuts'
import i18n from '../../i18n'

const {
  default: Form,
  FormItem,
  FormRow,
  buttonSave,
  buttonCancel,
} = components.form

export default function DirectionNameForm (props) {
  const {
    visible, defaultName,
    onClose, onSubmit,
    wrapper: Wrapper,
  } = props

  const [ name, setName ] = useState(defaultName)
  useEffect(() => {
    visible && setName(defaultName || '')
  }, [ visible ])

  const handleChange = ({ target: { value } }) => setName(value)

  const handleSubmit = () => {
    onSubmit(name)
    onClose()
  }

  return visible && (
    <Wrapper
      title={i18n.DIRECTION}
      onClose={onClose}
      defaultPosition={{ x: window.screen.width * 0.5, y: window.screen.height * 0.02 }}>
      <FocusTrap>
        <HotKeysContainer>
          <Form className="direction_name--form">
            <FormRow label={`${i18n.DESIGNATION}:`}>
              <Input value={name} onChange={handleChange} />
            </FormRow>
            <FormItem>
              {buttonSave(handleSubmit)}
              {buttonCancel(onClose)}
            </FormItem>
          </Form>
          <HotKey onKey={onClose} selector={shortcuts.ESC}/>
        </HotKeysContainer>
      </FocusTrap>
    </Wrapper>
  )
}

DirectionNameForm.propTypes = {
  defaultName: PropTypes.string,
  index: PropTypes.number,
  visible: PropTypes.bool.isRequired,
  wrapper: PropTypes.any,
  /** actions */
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}
