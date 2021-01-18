import React, { useState } from 'react'
import PropTypes from 'prop-types'
import FocusTrap from 'react-focus-lock'
import {
  Input,
  ButtonSave,
  ButtonCancel,
  HotKey,
  HotKeysContainer,
  FormColumnFloat,
  useController,
  MovablePanel,
  InputsController,
  DatePicker,
} from '@C4/CommonComponents'
import moment from 'moment'
import i18n from '../../../i18n'
import { shortcuts } from '../../../constants'
import './style.css'

const MIN_HEIGHT_MODAL = 250
const MAX_HEIGHT_MODAL = MIN_HEIGHT_MODAL
const MIN_WIDTH_MODAL = 500
const MAX_WIDTH_MODAL = MIN_WIDTH_MODAL

const name = 'name'
const dateFor = 'dateFor'

const GET_DEFAULT_VALUE = () => Object.freeze({
  [name]: null,
  [dateFor]: moment(),
})

export const CreateNewLayerModal = ({
  disabled,
  wrapper: Wrapper,
  onClose,
  onSave,
}) => {
  const [ value, onChange ] = useState(GET_DEFAULT_VALUE)
  const [ errors, setErrors ] = useState({})
  const onChangeHandler = ({ target: { value } }) => onChange(value)
  const onMomentChange = ({ target: { value: curV } }) => onChange({ ...value, [dateFor]: curV || moment() })

  const onSaveHandler = async () => {
    const res = !disabled && await onSave(value)
    res?.errors && setErrors(res.errors)
  }

  const inputs = useController(InputsController, { value, onChange: onChangeHandler, errors, setErrors, disabled })

  return <Wrapper
    title={i18n.CREATE}
    minWidth={MIN_WIDTH_MODAL}
    minHeight={MIN_HEIGHT_MODAL}
    maxHeight={MAX_HEIGHT_MODAL}
    maxWidth={MAX_WIDTH_MODAL}
    onClose={onClose}
  >
    <HotKeysContainer>
      <FocusTrap>
        <FormColumnFloat label={i18n.REQUIRED(i18n.DESIGNATION)} {...inputs.label(name)} >
          <Input {...inputs.input(name)} />
        </FormColumnFloat>
        <FormColumnFloat label={i18n.AS_OF} {...inputs.label(dateFor)} >
          <DatePicker {...inputs.input(dateFor)} onChange={onMomentChange} showTime />
        </FormColumnFloat>
        <ButtonSave onClick={onSaveHandler} disabled={disabled}/>
        <ButtonCancel onClick={onClose} disabled={disabled}/>
        <HotKey onKey={onSaveHandler} selector={shortcuts.ENTER}/>
        <HotKey onKey={onClose} selector={shortcuts.ESC}/>
      </FocusTrap>
    </HotKeysContainer>
  </Wrapper>
}

CreateNewLayerModal.displayName = 'CreateNewLayerModal'
CreateNewLayerModal.propTypes = {
  wrapper: PropTypes.oneOf([ MovablePanel ]),
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  onRemove: PropTypes.func,
  fields: PropTypes.object,
  data: PropTypes.object,
  catalogId: PropTypes.string,
  title: PropTypes.string,
  disabled: PropTypes.bool,
}
