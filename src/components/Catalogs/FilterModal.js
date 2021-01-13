import React, { useState } from 'react'
import memoize from 'memoize-one'
import PropTypes from 'prop-types'
import {
  Input,
  FilterInput,
  DatePicker,
  TextArea,
  ButtonSave,
  ButtonCancel,
  HotKey,
  HotKeysContainer,
  Coordinates,
  FormColumnFloat,
  MovablePanel,
  ButtonDelete,
} from '@C4/CommonComponents'
import i18n from '../../i18n'
import { shortcuts } from '../../constants'
import './style.css'

const HEIGHT_MODAL = 600
const WIDTH_MODAL = 300
const DEFAULT_VALUE = Object.freeze({})
const DEFAULT_ARRAY = []

const getFilterValues = (v = []) => [
  { id: null, name: i18n.UNDEFINED },
  ...v.map((name) => ({ name, id: name })),
]

const getElementByType = ({ typeOfInput, label, source, fieldName: name }) => {
  const commonProps = { name, label, typeOfInput }
  switch (typeOfInput) {
    case 'number': return { Component: Input.Number, props: { ...commonProps, min: 0 } }
    case 'array': return { Component: FilterInput, props: { ...commonProps, values: getFilterValues(source?.values) } }
    case 'date': return { Component: DatePicker, props: { ...commonProps, showTime: true } }
    case 'textarea': return { Component: TextArea, props: commonProps }
    case 'geometry': return { Component: Coordinates, props: { ...commonProps, hasValue: true } }
    default: return { Component: Input, props: commonProps }
  }
}

const getElementsByType = memoize((attributes = []) => attributes.map(getElementByType))

export const CatalogFilterModal = ({
  wrapper: Wrapper,
  title,
  onClose,
  onSave,
  onRemove,
  fields = DEFAULT_ARRAY,
  data = DEFAULT_VALUE,
  catalogId,
}) => {
  const [ value, onChange ] = useState(data)

  const onChangeHandler = (target, targetName) => {
    if (target?.target) {
      const { name, value: curValue } = target.target
      return onChange({ ...value, [name]: curValue })
    }
    return onChange({ ...value, [targetName]: target })
  }

  const onSaveHandler = () => {
    const filteredValues = Object.entries(value).filter(([ , value ]) => Boolean(value))
    filteredValues.length
      ? onSave({ [catalogId]: Object.fromEntries(filteredValues) })
      : onRemove(catalogId)
    onClose()
  }

  const onRemoveHandler = () => {
    onRemove(catalogId)
    onClose()
  }

  const components = getElementsByType(fields)

  return <Wrapper
    title={`${i18n.FILTER} "${title}"`}
    minWidth={WIDTH_MODAL}
    minHeight={HEIGHT_MODAL}
    className="catalog-filter"
    defaultSize={{
      width: 800,
      height: 600,
    }}
    onClose={onClose}
  >
    <HotKeysContainer>
      <div className="catalog-filter__wrap">
        <div className="catalog-filter__content">
          {components.map(({ Component, props: { label, typeOfInput, hasValue, name, ...otherProps } }, key) =>
            <FormColumnFloat label={label} hasValue={hasValue || Boolean(value[name])} key={key}>
              <Component
                {...otherProps}
                key={name}
                name={name}
                value={value[name] ?? ''}
                onChange={(target) => onChangeHandler(target, name)}
              />
            </FormColumnFloat>,
          )}
        </div>
        <ButtonSave onClick={onSaveHandler}/>
        <ButtonCancel onClick={onClose}/>
        <ButtonDelete onClick={onRemoveHandler} disabled={value === DEFAULT_VALUE}/>
        <HotKey onKey={onSaveHandler} selector={shortcuts.ENTER}/>
        <HotKey onKey={onClose} selector={shortcuts.ESC}/>
      </div>
    </HotKeysContainer>
  </Wrapper>
}

CatalogFilterModal.displayName = 'CatalogFilterModal'
CatalogFilterModal.propTypes = {
  wrapper: PropTypes.oneOf([ MovablePanel ]),
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  onRemove: PropTypes.func,
  fields: PropTypes.object,
  data: PropTypes.object,
  visible: PropTypes.bool,
  catalogId: PropTypes.string,
  title: PropTypes.string,
}
