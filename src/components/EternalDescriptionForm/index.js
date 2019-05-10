import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Input, InputNumber } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import FocusTrap from 'react-focus-lock'
import { HotKeysContainer, HotKey } from '../common/HotKeys'
import * as shortcuts from '../../constants/shortcuts'
import i18n from '../../i18n'

const {
  default: Form,
  Coordinates: CoordinatesField,
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

  const coordRef = React.createRef()
  const descRef = React.createRef()

  // @TODO: при сабмите вызывать метод из вебмапы  для апдейта
  const handleSubmit = () => {
    const { lat, lng } = coordRef.current.finalResult
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
              <CoordinatesField coordinates={coordinates} ref={coordRef}/>
            </FormRow>
            <FormRow label={`${i18n.DESCRIPTION}:`}>
              <TextArea defaultValue={description} ref={descRef}/>
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
