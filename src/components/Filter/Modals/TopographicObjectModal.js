import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Input,
  ButtonApply,
  ButtonCancel,
  HotKey,
  HotKeysContainer,
  FormColumnFloat,
  MovablePanel,
  ButtonDelete,
  useController,
  InputsController,
  FilterInput,
  Checkbox,
  FormRow,
} from '@C4/CommonComponents'
import i18n from '../../../i18n'
import { shortcuts } from '../../../constants'
import './style.css'

const HEIGHT_MODAL = '80vh'
const WIDTH_MODAL = '80vw'
const MIN_WIDTH_MODAL = '400px'
const MIN_HEIGHT_MODAL = '165px'
const DEFAULT_VALUE = Object.freeze({})
const DEFAULT_ARRAY = []
const valuesWithUndefined = (arr) => [ { id: '', name: i18n.UNDEFINED } ].concat(arr)
export const IS_OPERATION_ZONE = 'isOperationZone'

export const TopographicObjectFilterModal = ({
  wrapper: Wrapper,
  title,
  onClose,
  onSave,
  onRemove,
  fields = DEFAULT_ARRAY,
  data = DEFAULT_VALUE,
  flexGridPresent,
}) => {
  const [ value, onChange ] = useState(data)
  const isNew = data === DEFAULT_VALUE

  const onChangeHandler = ({ target: { value } }) => onChange(value)

  const inputs = useController(InputsController, { value, onChange: onChangeHandler })

  const onSaveHandler = () => {
    const filteredValues = Object.entries(value).filter(([ , value ]) => Boolean(value))
    filteredValues.length
      ? onSave(Object.fromEntries(filteredValues))
      : onRemove()
  }

  const getElement = ({ id, name, datatype, value: values }) => {
    const withWrap = (item, forceHasValue) =>
      <FormColumnFloat
        label={name}
        hasValue={forceHasValue || inputs.label(id).hasValue}
        key={id}
      >
        {item}
      </FormColumnFloat>
    if (Array.isArray(values)) {
      return withWrap(<FilterInput values={valuesWithUndefined(values)} {...inputs.input(id)}/>, true)
    }
    switch (datatype) {
      case 'integer': return withWrap(<Input.Integer {...inputs.input(id)} min="0" autoComplete="off"/>)
      case 'double precision': return withWrap(<Input.Number {...inputs.input(id)} min="0" autoComplete="off"/>)
      default: return withWrap(<Input {...inputs.input(id)} autoComplete="off"/>)
    }
  }
  const inputOperationZone = inputs.bool(IS_OPERATION_ZONE)
  return <Wrapper
    title={`${i18n.FILTER} "${title}"`}
    maxWidth={WIDTH_MODAL}
    minWidth={MIN_WIDTH_MODAL}
    minHeight={MIN_HEIGHT_MODAL}
    maxHeight={HEIGHT_MODAL}
    className="catalog-filter"
    defaultSize={{
      width: 600,
    }}
    onClose={onClose}
  >
    <HotKeysContainer>
      <div className="modal-objects__filter--wrap">
        <div className="modal-objects__filter--content">
          <FormRow label={i18n.FILTER_BY_OPERATION_ZONE} alignLabel="right" paddingH>
            <Checkbox
              {...inputOperationZone}
              value={flexGridPresent ? inputOperationZone.value : false}
              disabled={!flexGridPresent}
            />
          </FormRow>
          {fields.map(getElement)}
        </div>
        <div className="modal-objects__filter--buttons">
          <ButtonApply onClick={onSaveHandler}/>
          <ButtonCancel onClick={onClose}/>
          { !isNew && <ButtonDelete onClick={onRemove}/> }
          <HotKey onKey={onSaveHandler} selector={shortcuts.ENTER}/>
          <HotKey onKey={onClose} selector={shortcuts.ESC}/>
        </div>
      </div>
    </HotKeysContainer>
  </Wrapper>
}

TopographicObjectFilterModal.propTypes = {
  wrapper: PropTypes.oneOf([ MovablePanel ]),
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  onRemove: PropTypes.func,
  fields: PropTypes.object,
  data: PropTypes.object,
  title: PropTypes.string,
  flexGridPresent: PropTypes.bool,
}
