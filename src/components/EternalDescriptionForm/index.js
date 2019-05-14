import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Input } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import FocusTrap from 'react-focus-lock'
import { HotKeysContainer, HotKey } from '../common/HotKeys'
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

  const descRef = React.createRef()
  const [ coords, setCoords ] = useState(null)

  useEffect(() => {
    setCoords(coordinates)
  }, [ coordinates ])

  const handleSubmit = () => {
    const { lat, lng } = coords
    const desc = descRef.current.textAreaRef.value
    onSubmit({ lat, lng }, desc)
  }

  return visible && coords && (
    <Wrapper title={i18n.LINE_NODES} onClose={onClose}>
      <FocusTrap>
        <HotKeysContainer>
          <Form className="et_description--form">
            <FormRow label={i18n.COORDINATES}>
              <CoordinatesField coordinates={coords} onChange={setCoords}/>
            </FormRow>
            <FormRow label={`${i18n.DESCRIPTION}:`}>
              <TextArea className="et_description--desc_input" defaultValue={description} ref={descRef}/>
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
