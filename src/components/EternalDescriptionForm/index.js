import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Input } from 'antd'
import { components } from '@C4/CommonComponents'
import FocusTrap from 'react-focus-lock'
import { HotKeysContainer, HotKey } from '../common/HotKeys'
import placeSearch from '../../server/places'
import * as shortcuts from '../../constants/shortcuts'
import i18n from '../../i18n'
import './eternalDescriptionForm.css'

const {
  default: Form,
  Coordinates: CoordinatesField,
  FormRow,
  buttonSave,
  buttonCancel,
} = components.form

const { TextArea } = Input

export default function EternalDescriptionForm (props) {
  const {
    visible,
    description, coordinates,
    onClose, onSubmit,
    wrapper: Wrapper,
  } = props

  const textAreaRef = useRef(null)
  const [ coords, setCoords ] = useState(null)

  useEffect(() => {
    setCoords(coordinates)
  }, [ coordinates ])

  const handleSubmit = () => {
    const { lat, lng } = coords
    onSubmit({ lat, lng }, textAreaRef.current?.state?.value)
  }

  return visible && coords && (
    <Wrapper
      title={i18n.LINE_NODES}
      onClose={onClose}
      defaultPosition={{ x: window.screen.width * 0.5, y: window.screen.height * 0.02 }}>
      <FocusTrap>
        <HotKeysContainer>
          <Form className="et_description--form">
            <FormRow label={i18n.COORDINATES}>
              <CoordinatesField coordinates={coords} onExitWithChange={setCoords} onSearch={placeSearch}/>
            </FormRow>
            <FormRow label={`${i18n.DESCRIPTION}:`}>
              <TextArea className="et_description--desc_input" defaultValue={description} ref={textAreaRef}/>
            </FormRow>
            <FormRow>
              {buttonSave(handleSubmit)}
              {buttonCancel(onClose)}
            </FormRow>
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
