import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Input, InputNumber } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import FocusTrap from 'react-focus-lock'
import { HotKeysContainer, HotKey } from '../common/HotKeys'
import * as shortcuts from '../../constants/shortcuts'
import i18n from '../../i18n'

const formatter = (string) => typeof string === 'number' ? string : string.replace(/[^0-9.]/g, '')

const {
  default: Form,
  FormItem,
  FormRow,
  buttonSave,
  buttonCancel,
} = components.form

const { TextArea } = Input
// @TODO: сделать форму
export default function EternalDescriptionForm (props) {
  const {
    visible,
    description, coordinates,
    onClose, onSubmit,
    wrapper: Wrapper,
  } = props

  const latRef = React.createRef()
  const lngRef = React.createRef()
  const descRef = React.createRef()

  const handleSubmit = () => {
    const lat = +latRef.current.inputNumberRef.input.value
    const lng = +lngRef.current.inputNumberRef.input.value
    const desc = descRef.current.textAreaRef.value
    onSubmit({ lat, lng }, desc)
  }

  console.log('description', description)
  console.log('coordinates', coordinates)

  return visible && (
    <Wrapper title={'Узловая точка'} onClose={onClose}>
      <FocusTrap>
        <HotKeysContainer>
          <Form className="direction_name--form">
            <FormRow label={`Координати`}>
              <InputNumber defaultValue={coordinates.lat} formatter={formatter} ref={latRef}/>
              <InputNumber defaultValue={coordinates.lng} formatter={formatter} ref={lngRef}/>
            </FormRow>
            <FormRow label={`${i18n.DESCRIPTION}:`}>
              <TextArea defaultValue={description} onChange={console.log} ref={descRef}/>
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

EternalDescriptionForm.propTypes = {
  description: PropTypes.string,
  position: PropTypes.arrayOf(PropTypes.number),
  index: PropTypes.number,
  visible: PropTypes.bool.isRequired,
  wrapper: PropTypes.any,
  /** actions */
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}
